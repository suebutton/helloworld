const LinkBuilder = require('./link-builder');
const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const { matchHomepage } = require('../app-mapping');

/**
 * Resy
 *
 * Supports the following destination:
 *
 * {
 *   pathname,
 *   query,
 *   hash
 * }
 *
 */
class Resy extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol: 'resy',
      hostname: 'resy.com',
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.resy.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('resy', appDestination);
  }
}

Resy.AppMappings = [{ match: matchHomepage }];

module.exports = Resy;
