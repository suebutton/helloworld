const LinkBuilder = require('./link-builder');
const { formatUrl } = require('../lib');
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

  getPartnerSubdomain() {
    return 'resy';
  }
}

Resy.AppMappings = [{ match: matchHomepage }];

module.exports = Resy;
