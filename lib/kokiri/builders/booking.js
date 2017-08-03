const { extend } = require('lodash');
const { formatUrl, attributeQuery } = require('../lib');

const LinkBuilder = require('./link-builder');

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
  query(destination, attributionToken) {
    const { query } = destination;

    /**
     * The aid is the affiliate account id for Button account for the Booking.com
     * affiliate system
     */
    const aid = '858965';
    const label = attributionToken;

    return extend({}, query, { aid, label });
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'https',
      hostname: 'booking.com',
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

  getUniversalLinkDestination(destination, attributionToken) {
    const { pathname, hash } = destination;
    const query = this.query(destination, attributionToken);

    return {
      pathname,
      query: attributeQuery(query, attributionToken, 'label'),
      hash,
    };
  }

  getPartnerSubdomain() {
    return 'booking';
  }
}

Booking.AppMappings = [{ match: true }];

module.exports = Booking;
