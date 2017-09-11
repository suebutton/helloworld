const { OS_IOS } = require('../../constants');
const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Minibar
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
class Minibar extends LinkBuilder {
  getAppLink(appDestination, platform) {
    const [protocol, hostname] =
      platform === OS_IOS
        ? ['minibar', null]
        : ['https', 'minibardelivery.bttn.io'];

    return formatUrl({
      protocol,
      hostname,
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
      hostname: 'www.minibardelivery.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'minibardelivery';
  }
}

Minibar.AppMappings = [{ match: matchHomepage }];

module.exports = Minibar;
