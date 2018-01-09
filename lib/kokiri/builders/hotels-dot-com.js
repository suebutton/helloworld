const { extend } = require('lodash');

const { formatUrl } = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');
const LinkBuilder = require('./link-builder');

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

class HotelsDotCom extends LinkBuilder {
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

    return extend({}, query, { rffrid });
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
      hostname: 'www.hotels.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'hotels';
  }

  getUniversalLinkDestination(destination, platform, attributionToken) {
    const { pathname, hash } = destination;
    const query = this.query(destination, attributionToken);

    return { pathname, query, hash };
  }
}

HotelsDotCom.AppMappings = [
  {
    match: matchPathname('/ho:hotelid(\\d+)/(.*)?'),
    destination: {
      pathname: '/PPCHotelDetails',
      query: (match, prevQuery) =>
        extend({}, prevQuery, { hotelid: match.hotelid }),
    },
  },
  {
    match: matchPathname('/de:destinationid(\\d+)/(.*)?'),
    destination: {
      pathname: '/PPCSearch',
      query: (match, prevQuery) =>
        extend({}, prevQuery, { destinationid: match.destinationid }),
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
