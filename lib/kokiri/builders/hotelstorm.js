const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * HotelStorm
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
class HotelStorm extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol: 'hotelstorm.noapp',
      hostname: null,
      pathname: null,
      query: null,
      hash: null,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.hotelstorm.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return null;
  }
}

HotelStorm.AppMappings = [{ match: matchHomepage }];

module.exports = HotelStorm;
