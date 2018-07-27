const LinkBuilder = require('./link-builder');
const { formatUrl, normalizeHostname, parseUrl } = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');

/**
 * expedia
 *
 * Supports the following destination object:
 *
 * {
 *   pathname,
 *   query,
 *   hash
 * }
 *
 */

const AFFCID_NAME = 'affcid';
const AFFCID_FALLBACK = 'US.NETWORK.BUTTON.300843';

class Expedia extends LinkBuilder {
  affcid() {
    return this.getPartnerValue(AFFCID_NAME, AFFCID_FALLBACK);
  }

  hostname(destination) {
    const { hostname } = destination;
    return normalizeHostname(hostname) || 'expedia.com';
  }

  query(destination, attributionToken) {
    const { query } = destination;

    const AFFCID = this.affcid();
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

  getDestinationFromUrl(url) {
    const { hostname } = parseUrl(url);

    return { ...super.getDestinationFromUrl(url), ...{ hostname } };
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
