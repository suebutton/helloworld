const { matchIOS } = require('../app-mapping');
const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * Quandoo
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
class Quandoo extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'ubquandoo',
      hostname: null,
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getBrowserLink() {
    return null;
  }

  getPartnerSubdomain() {
    return null;
  }
}

Quandoo.AppMappings = [{ match: matchIOS }];

module.exports = Quandoo;
