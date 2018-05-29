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
}

HotelStorm.AppMappings = [{ match: matchHomepage }];

module.exports = HotelStorm;
