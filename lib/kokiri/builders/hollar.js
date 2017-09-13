const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');
const { OS_IOS } = require('../../constants');

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
  getAppLink(appDestination, platform) {
    const [hostname, pathname] =
      platform === OS_IOS ? [null, null] : ['t', 'home'];

    return formatUrl({
      protocol: 'hollar',
      hostname,
      pathname,
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
