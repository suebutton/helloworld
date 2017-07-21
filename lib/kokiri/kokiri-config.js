const { format } = require('url');
const {
  groupBy,
  mapValues,
  get,
  extend,
  map,
  isNull,
  some,
  isFunction,
  isString,
} = require('lodash');

const {
  parseUrl,
  isHostnameMatch,
  isArrayMatch,
  normalizeHostname,
  urlCacheKey,
} = require('./lib');
const { createBuilder } = require('./builders');
const { KokiriError } = require('./errors');

const TRACK_BTTNIO_REGEX = /^track\.bttn\.io\/([^/]+).*/;
const SUB_BTTNIO_REGEX = /^(?!track)([^.]+)\.bttn\.io(?:\/.*|$)/;
const BTTNIO_REGEX = /^(?:track\.bttn\.io\/([^/]+).*|(?!track)([^.]+)\.bttn\.io(?:\/.*|$))/;

/**
 *
 * KokiriConfig is the primary stateful object used to:
 *
 *   * determine support for enhancing a link
 *   * actually enhance a link
 *   * generate configs to be shipped to hydrate other KokiriConfig instances
 *   * generate configs to power SDK synchronous enhancement checks
 *
 * ## Public Interface
 *
 *   * #supportedAffiliateByUrl(url)
 *   * #merchantIdByUrl(url)
 *   * #shouldRedirectByUrl(url)
 *   * #redirectCacheKey(url)
 *   * #createBuilder(publisherId, merchantId)
 *   * #createBuilderByUrl(publisherId, url)
 *   * #destinationUrlFromBttnioUrl(url)
 *   * #destinationUrlFromAffiliateUrl(url)
 *   * #isApproved(publisherId, merchantId)
 *   * #toSDKConfig(publisherId)
 *   * #toModuleConfig(publisherId)
 *
 *   * KokiriConfig.fromModuleConfig(config)
 *
 */
class KokiriConfig {
  constructor(
    supportedMerchants,
    supportedAffiliateQueryIds,
    supportedAffiliatePathnameIds,
    supportedAffiliates,
    webToAppMappings,
    approvals
  ) {
    this._supportedMerchants = supportedMerchants || [];
    this._supportedAffiliateQueryIds = supportedAffiliateQueryIds || [];
    this._supportedAffiliatePathnameIds = supportedAffiliatePathnameIds || [];
    this._supportedAffiliates = supportedAffiliates || [];
    this._webToAppMappings = webToAppMappings || [];
    this._approvals = approvals || [];
  }

  /**
   * @private
   * @param  {string} hostname
   * @param  {string} pathname
   * @return {Boolean} Whether or not this is a track.bttn.io/<partner> domain
   */
  isBttnioTrackDomain(hostname, pathname) {
    return !!TRACK_BTTNIO_REGEX.exec(hostname + pathname);
  }

  /**
   * @private
   * @param  {string} hostname
   * @param  {string} pathname
   * @return {Boolean} Whether or not this is a <partner>.bttn.io domain
   */
  isBttnioSubdomain(hostname, pathname) {
    return !!SUB_BTTNIO_REGEX.exec(hostname + pathname);
  }

  /**
   * bttn.io domains come in two flavors:
   *   * track.bttn.io/<partner>
   *   * <partner>.bttn.io
   *
   * This method will attempt to return the subdomain (<partner>) in the above
   * examples or null if one can't be found.
   *
   * @private
   * @param  {string} hostname
   * @param  {string} pathname
   * @return {string|null} The extracted partner subdomain
   */
  bttnioSubdomain(hostname, pathname) {
    const match = BTTNIO_REGEX.exec(hostname + pathname);

    if (!match) {
      return null;
    }

    return match[1] || match[2];
  }

  /**
   * @private
   * @param  {string} publisherId
   * @return {array<object>} All approval records relevant to a given partner.
   */
  relevantApprovals(publisherId) {
    return this._approvals.filter(a => a.audience === publisherId);
  }

  /**
   * @private
   * @param  {string} publisherId
   * @return {Set<string>} A Set of all approved merchants for a Publisher
   */
  approvals(publisherId) {
    const approvals = this._approvals
      .filter(a => a.status === 'approved' && a.audience === publisherId)
      .map(a => a.organization);

    return new Set(approvals);
  }

  /**
   * @private
   * @param  {string} publisherId
   * @return {Set<string>}
   */
  supportedApprovedMerchantOrganizationIds(publisherId) {
    const organizationIds = this.approvedSupportedMerchants(publisherId).map(
      m => m.organization_id
    );

    return new Set(organizationIds);
  }

  /**
   * @private
   * @param  {string} publisherId
   * @return {array<object>} The approved supported merchant records for the
   *   given publisher.
   */
  approvedSupportedMerchants(publisherId) {
    const approvals = this.approvals(publisherId);

    return this._supportedMerchants.filter(m =>
      approvals.has(m.organization_id)
    );
  }

  /**
   * @private
   * @param  {string} publisherId
   * @return {array<object>} The approved supported web-to-app-mapping records
   *   for the given publisher.
   */
  approvedWebToAppMappings(publisherId) {
    const approvals = this.approvals(publisherId);

    return this._webToAppMappings.filter(w => approvals.has(w.organization));
  }

  /**
   * @private
   * @param  {string} publisherId
   * @return {array<object>} The approved supported affiliate query id records
   *   for the given publisher.
   */
  approvedSupportedAffiliateQueryIds(publisherId) {
    const approvals = this.approvals(publisherId);

    return this._supportedAffiliateQueryIds.filter(a =>
      approvals.has(a.organization_id)
    );
  }

  /**
   * @private
   * @param  {string} publisherId
   * @return {array<object>} The approved supported affiliate pathname id
   *   records for the given publisher.
   */
  approvedSupportedAffiliatePathnameIds(publisherId) {
    const approvals = this.approvals(publisherId);

    return this._supportedAffiliatePathnameIds.map(p =>
      extend({}, p, {
        matches: p.matches.filter(
          m => approvals.has(m.organization_id) || isNull(m.organization_id)
        ),
      })
    );
  }

  /**
   * Used by the SDK
   *
   * Returns the approved and supported merchant records with only hostnames.
   *
   * @private
   * @param  {string} publisherId
   * @return {array<object>} An array of objects each with a `hostname` key
   */
  supportedHostnames(publisherId) {
    return this.approvedSupportedMerchants(publisherId)
      .concat(this.supportedBttnioHostnames(publisherId))
      .filter(m => m.organization_id !== publisherId)
      .map(m => ({ hostname: m.hostname }));
  }

  /**
   * Used by the SDK
   *
   * Returns the approved and supported bttnio subdomain records with only
   * subdomains.
   *
   * @private
   * @param  {string} publisherId
   * @return {array<object>} An array of objects each with a `subdomain` key
   */
  supportedBttnioSubdomains(publisherId) {
    return this.approvedWebToAppMappings(publisherId).map(w => ({
      subdomain: w.subdomain_name,
    }));
  }

  /**
   * Used by the SDK
   *
   * Returns the approved and supported external host records with only
   * hostnames.
   *
   * @private
   * @param  {string} publisherId
   * @return {array<object>} An array of objects each with a `hostname` key
   */
  supportedBttnioHostnames(publisherId) {
    const supportedMerchants = this.supportedApprovedMerchantOrganizationIds(
      publisherId
    );

    return this.approvedWebToAppMappings(publisherId)
      .filter(w => !supportedMerchants.has(w.organization))
      .map(w => ({
        hostname: normalizeHostname(parseUrl(w.external_host).hostname),
      }));
  }

  /**
   * Used by the SDK
   *
   * Returns the supported affiliate objects, with all ids scoped by
   * publisher approval.
   *
   * @private
   * @param  {string} publisherId
   * @return {array<object>} An array of objects each with a `subdomain` key
   */
  supportedAffiliates(publisherId) {
    const affiliateQueryIdMap = this.affiliateQueryIdMap(publisherId);

    return this._supportedAffiliates.map(a => {
      const queryUrlKeys = a.query_url_keys.map(k => ({ key: k.key }));

      // `hostname` can include periods, so best to avoid lodash#get.
      const affiliateQueryIds = affiliateQueryIdMap[a.hostname] || {};

      const queryIds = map(affiliateQueryIds, (v, k) => ({
        key: k,
        values: v,
        guaranteed_action: true,
      }));

      const approvedPathnameIds = this.approvedSupportedAffiliatePathnameIds(
        publisherId
      ).filter(p => p.hostname === a.hostname);

      const pathnameIds = approvedPathnameIds.map(p => ({
        regex: p.regex,
        matches: p.matches.map(m => ({ values: m.values })),
        guaranteed_action: !p.redirect,
      }));

      return {
        hostname: a.hostname,
        query_url_keys: queryUrlKeys,
        query_ids: queryIds,
        pathname_ids: pathnameIds,
      };
    });
  }

  /**
   * Returns a conveniently organized object for quick lookup of a ids for a
   * given affiliate hostname's query key.
   *
   * For instance, if linksynergy.com has a query param called "id", we can
   * quickly look up for a given Publisher's approvals supported merchant
   * values, i.e.
   *
   * `affiliateQueryIdMap(pub-XXX)['linksynergy.com']['id']`
   *
   * could return `[{ value: 'bloop1' }, { value: 'bloop2' }]``
   *
   * @private
   * @param  {string} publisherId
   * @return {object<string, object<string, array<object>>>}
   */
  affiliateQueryIdMap(publisherId) {
    return mapValues(
      groupBy(this.approvedSupportedAffiliateQueryIds(publisherId), 'hostname'),
      groupedAffiliates =>
        mapValues(groupBy(groupedAffiliates, 'key'), affiliateQueryIds =>
          affiliateQueryIds.map(a => ({ value: a.value }))
        )
    );
  }

  /**
   * Returns a list of destination urls extracted from the affiliate link.
   * For example:
   *
   * affiliateDestinationUrls(
   *   'linksynergy.com',
   *   'r',
   *   { bloop: true, url: 'http://bloop.com', murl: 'http://usebutton.com' }
   * );
   *
   * could return ['http://bloop.com']
   *
   * @private
   * @param  {string} hostname
   * @param  {string} pathname
   * @param  {object} query
   * @return {array<string>} A list of destination urls extracted from the
   *   affiliates query
   */
  affiliateDestinationUrls(hostname, pathname, query) {
    const affiliate = this._supportedAffiliates.find(a =>
      isHostnameMatch(a.hostname, hostname)
    );

    const queryUrlKeys = get(affiliate, 'query_url_keys', []);

    const urlsFromQuery = queryUrlKeys.reduce((acc, k) => {
      const value = query[k.key];
      return value ? acc.concat(value) : acc;
    }, []);

    const affiliatePathnameIds = this._supportedAffiliatePathnameIds.filter(i =>
      isHostnameMatch(i.hostname, hostname)
    );

    const urlsFromPathname = affiliatePathnameIds.reduce((acc, i) => {
      const match = new RegExp(i.regex).exec(pathname);

      if (!match) {
        return acc;
      }

      const values = match.slice(1);
      const url = KokiriConfig.merchantUrlFromRegexMatches(i.matches, values);

      return url ? acc.concat(url) : acc;
    }, []);

    return urlsFromQuery.concat(urlsFromPathname);
  }

  /**
   * Returns a merchant organization id by searching supported hostnames.
   *
   * @private
   * @param  {string} hostname
   * @return {string|null} A merchant id for the given hostname if supported
   *   or null if not found.
   */
  merchantIdFromSupportedMerchants(hostname) {
    return this._supportedMerchants.reduce((acc, m) => {
      if (acc) {
        return acc;
      }

      return isHostnameMatch(m.hostname, hostname) ? m.organization_id : null;
    }, null);
  }

  /**
   * Returns the merchant organization id pointed at by a bttn.io link, or null
   * if not found.
   *
   * @private
   * @param  {string} hostname
   * @param  {string} pathname
   * @return {string|null} The merchant id pointed at by a bttn.io link,
   *   or null if not found.
   */
  merchantIdFromWebToAppMappings(hostname, pathname) {
    const merchantId = this.merchantIdFromWebToAppMappingExternalHostname(
      hostname
    );

    if (merchantId) {
      return merchantId;
    }

    const bttnioSubdomain = this.bttnioSubdomain(hostname, pathname);

    return this._webToAppMappings.reduce((acc, s) => {
      if (acc) {
        return acc;
      }

      return s.subdomain_name === bttnioSubdomain ? s.organization : null;
    }, null);
  }

  /**
   * Returns the merchant organization id pointed at by a hostname or null if
   * not found in the web-to-app-mappings.
   *
   * @private
   * @param  {string} hostname
   * @return {string|null} The merchant id pointed at by a bttn.io link,
   *   or null if not found.
   */
  merchantIdFromWebToAppMappingExternalHostname(hostname) {
    return this._webToAppMappings.reduce((acc, s) => {
      if (acc) {
        return acc;
      }

      const { hostname: external } = parseUrl(s.external_host);
      return isHostnameMatch(hostname, external) ? s.organization : null;
    }, null);
  }

  /**
   * Returns the merchant bttnio subdomain for a provided organization.
   *
   * TODO: At present, we expect organizations with greater than one subdomain
   * to define the expected bttnio subdomain on the LinkBuilder subclass.
   *
   * @private
   * @param  {string} merchantId
   * @return {string|null} The subdomain pointed at by a merchantId,
   *   or null if not found.
   */
  bttnioSubdomainFromMerchantId(merchantId) {
    const webToAppMapping = this._webToAppMappings.find(
      w => w.organization === merchantId
    );

    return webToAppMapping ? webToAppMapping.subdomain_name : null;
  }

  /**
   * Returns the merchant id pointed at by an affiliate link.
   *
   * @private
   * @param  {string} hostname The affiliate hostname
   * @param  {string} pathname The affiliate pathname
   * @param  {object} query The affiliate query
   * @return {string|null} The merchant id pointed at by an affiliate link's,
   *   query or null if not found.
   */
  merchantIdFromSupportedAffiliates(hostname, pathname, query) {
    const destinationUrls = this.affiliateDestinationUrls(
      hostname,
      pathname,
      query
    );

    const destinationMerchantIdMatch = destinationUrls.reduce((acc, d) => {
      if (acc) {
        return acc;
      }

      const { hostname, pathname } = parseUrl(d);
      const merchantId = this.merchantIdFromSupportedMerchants(hostname);

      if (merchantId) {
        return merchantId;
      }

      return this.merchantIdFromWebToAppMappings(hostname, pathname);
    }, null);

    if (destinationMerchantIdMatch) {
      return destinationMerchantIdMatch;
    }

    const affiliateQueryIds = this._supportedAffiliateQueryIds.filter(i =>
      isHostnameMatch(i.hostname, hostname)
    );

    return affiliateQueryIds.reduce((acc, i) => {
      if (acc) {
        return acc;
      }

      return query[i.key] === i.value ? i.organization_id : null;
    }, null);
  }

  /**
   * Returns the merchant url matched by examining all pathname match candidates
   * against a set of values.
   *
   * @private
   * @param  {array<object>} pathnameMatches The candidates to match against
   * @param  {array<string>} pathnameMatches[i].values The candidate's values
   * @param  {string} pathnameMatches[i].organization_id The candidate's
   *   organization_id
   * @param  {object} pathnameMatches The candidates to match against
   * @param  {array<string>} values The target values
   * @return {string|null} The merchant url or null if not found.
   */
  static merchantUrlFromRegexMatches(pathnameMatches, values) {
    return pathnameMatches.reduce((acc, p) => {
      if (acc) {
        return acc;
      }

      return isArrayMatch(p.values, values) ? p.url : null;
    }, null);
  }

  /**
   * Returns a redirect boolean matched by examining all pathname match candidates
   * against a set of values.
   *
   * @private
   * @param  {array<object>} pathnameMatches The candidates to match against
   * @param  {array<string>} values The target values
   * @return {boolean} true or false
   */
  static shouldRedirectFromRegexMatches(pathnameMatches, values) {
    return some(pathnameMatches.map(p => isArrayMatch(p.values, values)));
  }

  /**
   * Returns an affiliate record describing a matching affiliate
   *
   * @param  {string} url
   * @return {object|null} The matching affiliate record or null if not found.
   */
  supportedAffiliateByUrl(url) {
    const { hostname } = parseUrl(url);

    return (
      this._supportedAffiliates.find(a =>
        isHostnameMatch(a.hostname, hostname)
      ) || null
    );
  }

  /**
   * Returns the merchant id for a url, if supported.
   *
   * This method is not sensitive to approvals.
   *
   * @param  {string} url
   * @return {string|null} The merchant id
   */
  merchantIdByUrl(url) {
    const { hostname, pathname, query } = parseUrl(url);

    let merchantId = this.merchantIdFromSupportedMerchants(hostname);

    if (merchantId) {
      return merchantId;
    }

    merchantId = this.merchantIdFromWebToAppMappings(hostname, pathname);

    if (merchantId) {
      return merchantId;
    }

    return this.merchantIdFromSupportedAffiliates(hostname, pathname, query);
  }

  /**
   * Returns true if the link should be unwound by following the redirect.
   *
   * This method is not sensitive to approvals.
   *
   * @param  {string} url
   * @return {boolean} boolean variable initiating a redirect
   */
  shouldRedirectByUrl(url) {
    return this.redirectAffiliatePathnameIdByUrl(url) !== null;
  }

  /**
   * Returns an appropriate cache key for the specified url.
   *
   * @param  {string} url
   * @return {string}
   */
  redirectCacheKey(url) {
    const getCacheKey = get(
      this.redirectAffiliatePathnameIdByUrl(url),
      'getCacheKey'
    );

    if (isFunction(getCacheKey)) {
      const cacheKey = getCacheKey(url);

      if (isString(cacheKey) && cacheKey.length > 0) {
        return cacheKey;
      }
    }

    return urlCacheKey(url);
  }

  /**
   * Returns an instantiated LinkBuilder instance specific to the merchant id.
   *
   * @param  {string} publisherId
   * @param  {string} merchantId
   * @return {LinkBuilder} The merchant-specific LinkBuilder instance
   */
  createBuilder(publisherId, merchantId) {
    if (!publisherId) {
      throw new KokiriError(`Invalid publisherId: ${publisherId}`);
    }

    if (!merchantId) {
      throw new KokiriError(`Invalid merchantId: ${merchantId}`);
    }

    if (!this.isApproved(publisherId, merchantId)) {
      throw new KokiriError(
        `Merchant ${merchantId} is not approved for link building with ${publisherId}.`
      );
    }

    return createBuilder(this, publisherId, merchantId);
  }

  /**
   * Returns an instantiated LinkBuilder instance specific to the merchant id
   * derived from `url`
   *
   * @param  {string} publisherId
   * @param  {string} url
   * @return {LinkBuilder} The merchant-specific LinkBuilder instance
   */
  createBuilderByUrl(publisherId, url) {
    const merchantId = this.merchantIdByUrl(url);

    if (!merchantId) {
      throw new KokiriError(`Couldn't resolve merchant id from url (${url}).`);
    }

    return this.createBuilder(publisherId, merchantId);
  }

  /**
   * @private
   * @param  {string} url
   * @return {?Object}
   */
  redirectAffiliatePathnameIdByUrl(url) {
    const { hostname, pathname } = parseUrl(url);

    const affiliatePathnameIds = this._supportedAffiliatePathnameIds.filter(
      i => isHostnameMatch(i.hostname, hostname) && i.redirect
    );

    return affiliatePathnameIds.reduce((acc, i) => {
      if (acc !== null) {
        return acc;
      }

      const match = new RegExp(i.regex).exec(pathname);

      if (!match) {
        return null;
      }

      const isMatch = KokiriConfig.shouldRedirectFromRegexMatches(
        i.matches,
        match.slice(1)
      );

      return isMatch ? i : null;
    }, null);
  }

  /**
   * Returns the destination link for a *.bttn.io.link
   *
   * @param  {string} url A *.bttn.io link
   * @return {string|null} The link a bttn.io link points to, or null if not
   *   found.
   */
  destinationUrlFromBttnioUrl(url) {
    const { hostname, pathname, query, hash } = parseUrl(url);

    const isTrackMatch = this.isBttnioTrackDomain(hostname, pathname);

    let destination;
    if (isTrackMatch) {
      destination = {
        pathname: `/${pathname.split('/').slice(2).join('/')}`,
        query,
        hash,
      };
    }

    const isSubdomainMatch = this.isBttnioSubdomain(hostname, pathname);

    if (isSubdomainMatch) {
      destination = {
        pathname,
        query,
        hash,
      };
    }

    const subdomain = this.bttnioSubdomain(hostname, pathname);

    const webToAppMapping = this._webToAppMappings.find(
      w => w.subdomain_name === subdomain
    );

    if (!webToAppMapping) {
      return null;
    }

    const externalHostname = parseUrl(webToAppMapping.external_host).hostname;

    if (!externalHostname) {
      return null;
    }

    return format(
      extend({}, destination, {
        protocol: 'http',
        hostname: externalHostname,
      })
    );
  }

  /**
   * Returns the link which an affiliate link points to.
   *
   * @param  {url} url An affiliate link
   * @return {string|null} The link an affiliate link was pointing at, or null
   *   if not found.
   */
  destinationUrlFromAffiliateUrl(url) {
    const { hostname, pathname, query } = parseUrl(url);

    const unwrappedUrl = get(
      this.affiliateDestinationUrls(hostname, pathname, query),
      0,
      null
    );

    return unwrappedUrl || null;
  }

  /**
   * @param  {string} publisherId
   * @param  {string} merchantId
   * @return {Boolean} Whether or not the pair is approved
   */
  isApproved(publisherId, merchantId) {
    return this.approvals(publisherId).has(merchantId);
  }

  /**
   * Returns a new instance of a KokiriConfig hydrated with state from...
   * somewhere.
   *
   * @param  {object} config The remote state
   * @return {KokiriConfig} A hydrated KokiriConfig
   */
  static fromModuleConfig(config) {
    if (!config) {
      return new KokiriConfig();
    }

    return new KokiriConfig(
      config.supported_merchants,
      config.supported_affiliate_query_ids,
      config.supported_affiliate_pathname_ids,
      config.supported_affiliates,
      config.web_to_app_mappings,
      config.approvals
    );
  }

  /**
   * Generates a serializable version of the internal state of a KokiriConfig
   * instance.  Can be used for hydrating remote instances from a centralized
   * server that can aggregate the required state.  Pairs nicely with
   * `KokiriConfig.fromModuleConfig`
   *
   * @param  {string} publisherId
   * @return {object} The internal state
   */
  toModuleConfig(publisherId) {
    const merchants = this.approvedSupportedMerchants(publisherId);
    const queryIds = this.approvedSupportedAffiliateQueryIds(publisherId);
    const pathnameIds = this.approvedSupportedAffiliatePathnameIds(publisherId);
    const affiliates = this._supportedAffiliates;
    const webToAppMappings = this.approvedWebToAppMappings(publisherId);
    const approvals = this.relevantApprovals(publisherId);

    return {
      supported_merchants: merchants,
      supported_affiliate_query_ids: queryIds,
      supported_affiliate_pathname_ids: pathnameIds,
      supported_affiliates: affiliates,
      web_to_app_mappings: webToAppMappings,
      approvals,
    };
  }

  /**
   * Generates a native javascript object used to describe support for enhancing
   * links to our SDKs.  All support is scoped to the approved merchants of a
   * provided Publisher.
   *
   * @param  {string} publisherId The publisher to filter support to
   * @return {object} The config
   */
  toSDKConfig(publisherId) {
    const supportedHostnames = this.supportedHostnames(publisherId);
    const supportedBttnioSubdomains = this.supportedBttnioSubdomains(
      publisherId
    );
    const supportedAffiliates = this.supportedAffiliates(publisherId);

    return {
      supported_hostnames: supportedHostnames,
      supported_bttnio_subdomains: supportedBttnioSubdomains,
      supported_affiliates: supportedAffiliates,
    };
  }
}

module.exports = KokiriConfig;
