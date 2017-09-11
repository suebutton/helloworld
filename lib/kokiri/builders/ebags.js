const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Ebags
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
class Ebags extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol: 'ebags.noapp',
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
      hostname: 'www.ebags.com',
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

Ebags.AppMappings = [{ match: matchHomepage }];

module.exports = Ebags;
