const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Houzz
 *
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
class Houzz extends LinkBuilder {
  getAppLink(appDestination) {
    const { hostname, pathname, query } = appDestination;

    return formatUrl({
      protocol: 'houzz',
      hostname,
      pathname,
      query,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.houzz.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('houzz', appDestination);
  }
}

Houzz.AppMappings = [{ match: matchHomepage }];

module.exports = Houzz;
