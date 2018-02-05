const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Warby Parker
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
class WarbyParker extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol: 'wp',
      hostname: 'warbyparker.com',
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.warbyparker.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'warbyparker';
  }
}

WarbyParker.AppMappings = [{ match: matchHomepage }];

module.exports = WarbyParker;
