const {
  formatUrl,
  formatButtonUniversalUrl,
  cleanPathname,
  normalizeHostname,
} = require('../lib');

const {
  composeMatches,
  matchPathname,
  matchHomepage,
  matchIOS,
  matchAndroid,
} = require('../app-mapping');

const LinkBuilder = require('./link-builder');

const UTM_CAMPAIGN_NAME = 'utmcampaign';
const UTM_CAMPAIGN_FALLBACK = 'us_location_buyer';
const UTM_CONTENT_NAME = 'utmcontent';
const UTM_CONTENT_FALLBACK = 'button';

const HOSTNAME_WHITELIST = new Set(['etsy.com', 'etsy.ca']);

class Etsy extends LinkBuilder {
  utmcampaign() {
    return this.getPartnerValue(UTM_CAMPAIGN_NAME, UTM_CAMPAIGN_FALLBACK);
  }

  utmcontent() {
    return this.getPartnerValue(UTM_CONTENT_NAME, UTM_CONTENT_FALLBACK);
  }

  protocol(destination) {
    return this.hostname(destination).endsWith('.ca') ? 'http' : 'https';
  }

  hostname(destination) {
    const { hostname } = destination;

    return HOSTNAME_WHITELIST.has(normalizeHostname(hostname))
      ? hostname
      : 'www.etsy.com';
  }

  query(destination) {
    return {
      ...destination.query,
      ...{
        utm_medium: 'affiliate',
        utm_source: 'button',
        utm_campaign: this.utmcampaign(),
        utm_content: this.utmcontent(),
      },
    };
  }

  getAppLink(appDestination) {
    const { pathname } = appDestination;

    return formatUrl({
      protocol: 'etsy',
      hostname: cleanPathname(pathname),
      pathname: null,
      query: this.query(appDestination),
      hash: null,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: this.protocol(destination),
      hostname: this.hostname(destination),
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, hash } = appDestination;
    const query = this.query(appDestination);

    return formatButtonUniversalUrl('etsy', {
      pathname,
      query,
      hash,
    });
  }
}

Etsy.AppMappings = [
  {
    match: matchPathname('/featured/:slug'),
  },
  {
    match: matchPathname('/listing/:id/:slug?'),
  },
  {
    match: composeMatches(matchPathname('/c/(.*)?'), matchIOS),
  },
  {
    match: composeMatches(matchAndroid, matchHomepage),
    destination: {
      pathname: '/home',
    },
  },
  {
    match: matchHomepage,
  },
];

Etsy.UniversalMappings = [
  {
    match: composeMatches(matchIOS, matchPathname('/uk')),
    destination: {
      pathname: '/',
    },
  },
  {
    match: composeMatches(matchIOS, matchPathname('/ca')),
    destination: {
      pathname: '/',
    },
  },
  {
    match: true,
  },
];

module.exports = Etsy;
