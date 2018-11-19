const LinkBuilder = require('./link-builder');
const { formatUrl, normalizeHostname } = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');

const AFFCID_NAME = 'affcid';
const AFFCID_FALLBACK = '300843';

const HOSTNAME_TO_REGION_MAP = {
  'expedia.com': 'US',
  'expedia.com.au': 'AU',
  'expedia.co.uk': 'UK',
  'expedia.de': 'DE',
  'expedia.es': 'ES',
  'expedia.fr': 'FR',
};

class Expedia extends LinkBuilder {
  hostname(destination) {
    if (normalizeHostname(destination.hostname) in HOSTNAME_TO_REGION_MAP) {
      return normalizeHostname(destination.hostname);
    }
    return 'expedia.com';
  }

  region(destination) {
    const hostname = this.hostname(destination);
    return HOSTNAME_TO_REGION_MAP[hostname] || 'US';
  }

  affcid(destination) {
    return [
      this.region(destination),
      'NETWORK',
      'BUTTON',
      this.getPartnerValue(AFFCID_NAME, AFFCID_FALLBACK),
    ].join('.');
  }

  query(destination, attributionToken) {
    const { query } = destination;

    const AFFCID = this.affcid(destination);
    const AFFLID = attributionToken;

    return { ...query, ...{ AFFCID, AFFLID } };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'https',
      hostname: `www.${this.hostname(appDestination)}/mobile/deeplink`,
      pathname,
      query: this.query(appDestination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: `www.${this.hostname(destination)}`,
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }
}

Expedia.AppMappings = [
  {
    match: matchPathname('/Flights'),
    destination: {
      pathname: 'Flights-search',
    },
  },
  {
    match: matchPathname('/Hotels'),
    destination: {
      pathname: 'Hotel-search',
    },
  },
  {
    match: matchPathname('/Cars'),
    destination: {
      pathname: 'carsearch',
    },
  },
  {
    match: matchPathname('/car-hire'),
    destination: {
      pathname: 'carsearch',
    },
  },
  {
    match: matchPathname('/Activities'),
    destination: {
      pathname: 'things-to-do',
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Expedia;
