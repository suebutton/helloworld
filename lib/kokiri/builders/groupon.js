const { get, extend, omit, invert } = require('lodash');

const {
  parseUrl,
  normalizeHostname,
  formatUrl,
  joinPathname,
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

const ACCEPTABLE_REGIONS = new Set(['us', 'uk']);

const UTM_CAMPAIGN_FALLBACK = '206994';
const TS_TOKEN_FALLBACK = 'US_AFF_0_204629_1660315_0';
const WID_NAME = 'wid';
const WID_FALLBACK = null;

class Groupon extends LinkBuilder {
  region(destination) {
    const { region } = destination;
    if (!ACCEPTABLE_REGIONS.has(region)) {
      return 'us';
    }
    return region;
  }

  utmCampaign(destination) {
    const tokenName = `utm-campaign-${this.region(destination)}`;
    return this.getPartnerValue(tokenName, UTM_CAMPAIGN_FALLBACK);
  }

  tsToken(destination) {
    const tokenName = `ts-token-${this.region(destination)}`;
    return this.getPartnerValue(tokenName, TS_TOKEN_FALLBACK);
  }

  wid() {
    return this.getPartnerValue(WID_NAME, WID_FALLBACK);
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

  redirectUrl(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: this.redirectHostname(destination),
      pathname,
      query: omit(query, [
        'utm_medium',
        'utm_source',
        'utm_campaign',
        'sid',
        'wid',
      ]),
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
      wid: this.wid(),
    });
  }

  linkQuery(destination, attributionToken) {
    return {
      tsToken: this.tsToken(destination),
      sid: attributionToken,
      url: this.redirectUrl(destination),
      wid: this.wid(),
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

  getPartnerSubdomain() {
    return null;
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
      matchPathname(/^\/?browse(?:$|\/.*)/)
    ),
    destination: { pathname: 'search' },
  },
  {
    match: matchPathname(/^\/?(getaways|goods)\/?$/, ['channel']),
    destination: {
      pathname: match => joinPathname(['channel', match.channel]),
    },
  },
  {
    match: matchHomepage,
  },
];

Groupon.redirectHostnameMap = {
  us: 'www.groupon.com',
  uk: 'www.groupon.co.uk',
};

Groupon.trackingHostnameMap = {
  us: 'tracking.groupon.com',
  uk: 't.groupon.co.uk',
};

Groupon.trackingHostnameToRegionMap = invert(Groupon.trackingHostnameMap);

module.exports = Groupon;
