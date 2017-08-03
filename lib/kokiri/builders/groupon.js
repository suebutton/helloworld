const { get, extend, omit, invert } = require('lodash');

const {
  parseUrl,
  normalizeHostname,
  formatUrl,
  joinPathname,
  attributeQuery,
} = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  matchPathname,
  matchQuery,
  matchHomepage,
  composeMatches,
} = require('../app-mapping');

/**
 * Groupon
 *
 * Supports the following destination object:
 *
 * {
 *   pathname,
 *   query,
 *   hash,
 *   region
 * }
 *
 * Current supported regions are 'us' and 'uk'.
 *
 */
class Groupon extends LinkBuilder {
  region(destination) {
    const { region } = destination;
    return region || 'us';
  }

  utmCampaign(destination) {
    return get(
      Groupon.campaignMap,
      [this.publisherId, this.region(destination)],
      '206994'
    );
  }

  tsToken(destination) {
    return get(
      Groupon.tsTokenMap,
      [this.publisherId, this.region(destination)],
      'US_AFF_0_206994_1652352_0'
    );
  }

  redirectHostname(destination) {
    return get(
      Groupon.redirectHostnameMap,
      this.region(destination),
      Groupon.redirectHostnameMap.us
    );
  }

  trackingHostname(destination) {
    return get(
      Groupon.trackingHostnameMap,
      this.region(destination),
      Groupon.trackingHostnameMap.us
    );
  }

  bttnioSubdomain(destination) {
    return get(
      Groupon.bttnioSubdomainMap,
      this.region(destination),
      Groupon.bttnioSubdomainMap.us
    );
  }

  redirectUrl(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: this.redirectHostname(destination),
      pathname,
      query: omit(query, ['utm_medium', 'utm_source', 'utm_campaign', 'sid']),
      hash,
      slashes: true,
    });
  }

  appQuery(destination, attributionToken) {
    const { query } = destination;

    return extend({}, query, {
      utm_medium: 'afl',
      utm_source: 'GPN',
      utm_campaign: this.utmCampaign(destination),
      sid: attributionToken,
    });
  }

  linkQuery(destination, attributionToken) {
    return {
      tsToken: this.tsToken(destination),
      sid: attributionToken,
      url: this.redirectUrl(destination),
    };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'groupon',
      hostname: null,
      pathname: joinPathname([
        'dispatch',
        this.region(appDestination),
        pathname,
      ]),
      query: this.appQuery(appDestination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    return formatUrl({
      protocol: 'https',
      hostname: this.trackingHostname(destination),
      pathname: '/r',
      query: this.linkQuery(destination, attributionToken),
      slashes: true,
    });
  }

  getDestinationFromUrl(url) {
    const { hostname, query } = parseUrl(url);
    const normalizedHostname = normalizeHostname(hostname);

    if (normalizedHostname in Groupon.trackingHostnameToRegionMap) {
      const baseDestination = super.getDestinationFromUrl(
        get(query, 'url', url)
      );

      return extend({}, baseDestination, {
        region: Groupon.trackingHostnameToRegionMap[normalizedHostname],
      });
    }

    const baseDestination = super.getDestinationFromUrl(url);
    return extend({}, baseDestination, {
      region: normalizedHostname.endsWith('.co.uk') ? 'uk' : 'us',
    });
  }

  getPartnerSubdomain(destination) {
    return this.bttnioSubdomain(destination);
  }

  getUniversalLinkDestination(destination, attributionToken) {
    const query = this.linkQuery(destination, attributionToken);

    return {
      pathname: '/r',
      query: attributeQuery(query, attributionToken, 'sid'),
    };
  }
}

Groupon.AppMappings = [
  {
    match: matchPathname(/^\/?deals?\/([^/]+)/, ['id']),
    destination: {
      pathname: match => joinPathname(['deal', match.id]),
    },
  },
  {
    match: composeMatches(
      matchQuery({ category: /.*/ }),
      matchPathname(/^\/?browse(?:$|\/.+)/)
    ),
    destination: { pathname: 'search' },
  },
  {
    match: matchHomepage,
  },
];

Groupon.campaignMap = {
  'org-2d432a88b9bb8bda': { us: '206994' }, // Ibotta
  'org-294d8a7f8adbd98f': { uk: '211215' }, // Quidco
};

Groupon.tsTokenMap = {
  'org-2d432a88b9bb8bda': { us: 'US_AFF_0_206994_1652352_0' }, // Ibotta
  'org-294d8a7f8adbd98f': { uk: 'UK_AFF_0_211215_1219277_0' }, // Quidco
};

Groupon.redirectHostnameMap = {
  us: 'www.groupon.com',
  uk: 'www.groupon.co.uk',
};

Groupon.trackingHostnameMap = {
  us: 'tracking.groupon.com',
  uk: 't.groupon.co.uk',
};

Groupon.bttnioSubdomainMap = {
  us: 'groupon-tracking',
  uk: 'groupon-uk-tracking',
};

Groupon.trackingHostnameToRegionMap = invert(Groupon.trackingHostnameMap);

module.exports = Groupon;
