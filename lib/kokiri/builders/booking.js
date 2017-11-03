const { get, extend } = require('lodash');

const LinkBuilder = require('./link-builder');
const { formatUrl } = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');

/**
 * Bookingdotcom
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
class Booking extends LinkBuilder {
  aid() {
    return get(Booking.AidMap, this.publisherId, '1364923');
  }

  query(destination, attributionToken) {
    const { query } = destination;

    const aid = this.aid();
    const label = attributionToken;

    return extend({}, query, { aid, label });
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.booking.com',
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
      hostname: 'www.booking.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return null;
  }
}

Booking.AppMappings = [
  {
    match: matchPathname(/^\/?index\.html$/),
  },
  {
    match: matchHomepage,
    destination: { pathname: '/index.html' },
  },
];

Booking.AidMap = {
  'org-2d432a88b9bb8bda': '858965', // Ibotta,
  'org-030575eddb72b4df': '1353900', // Shopkick
};

module.exports = Booking;
