const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Hollar
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
class Hollar extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol: 'hollar',
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
      hostname: 'www.hollar.com',
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

Hollar.AppMappings = [{ match: matchHomepage }];

module.exports = Hollar;
