const LinkBuilder = require('./link-builder');
const {
  formatUrl,
  parseUrl,
  formatButtonUniversalUrl,
  normalizeHostname,
} = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');

/**
 * HotelsDotCom
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

const RFFRID_PREFIX_NAME = 'rffrid-prefix';
const RFFRID_PREFIX_FALLBACK = 'aff.hcom.GL.049.000.00699.019';

const ALLOWED_HOSTNAME_LIST = new Set([
  'hotels.com',
  'au.hotels.com',
  'es.hotels.com',
  'fr.hotels.com',
  'sg.hotels.com',
  'uk.hotels.com',
]);

class HotelsDotCom extends LinkBuilder {
  hostname(destination) {
    if (ALLOWED_HOSTNAME_LIST.has(normalizeHostname(destination.hostname))) {
      return destination.hostname;
    }
    return 'www.hotels.com';
  }

  publisherToken(attributionToken) {
    const prefix = this.getPartnerValue(
      RFFRID_PREFIX_NAME,
      RFFRID_PREFIX_FALLBACK
    );
    return `${prefix}.${attributionToken}`;
  }

  query(destination, attributionToken) {
    const { query } = destination;
    const rffrid = this.publisherToken(attributionToken);

    return { ...query, ...{ rffrid } };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'hotelsapp',
      hostname: 'www.hotels.com',
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
      hostname: this.hostname(destination),
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatButtonUniversalUrl('hotels', {
      pathname,
      query: this.query(appDestination, attributionToken),
      hash,
    });
  }

  getDestinationFromUrl(url) {
    const { hostname } = parseUrl(url);
    return { ...super.getDestinationFromUrl(url), hostname };
  }
}

HotelsDotCom.AppMappings = [
  {
    match: matchPathname('/ho:hotelid(\\d+)/(.*)?'),
    destination: {
      pathname: '/PPCHotelDetails',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ hotelid: match.hotelid },
      }),
    },
  },
  {
    match: matchPathname('/de:destinationid(\\d+)/(.*)?'),
    destination: {
      pathname: '/PPCSearch',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ destinationid: match.destinationid },
      }),
    },
  },
  {
    match: matchPathname('/hotel/details.html/(.*)?'),
  },
  {
    match: matchPathname('/search.do/(.*)?'),
  },
  {
    match: matchPathname('/hotel-deals/(.*)?'),
  },
  {
    match: matchHomepage,
  },
];

module.exports = HotelsDotCom;
