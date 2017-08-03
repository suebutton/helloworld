const { formatUrl } = require('../lib');

const LinkBuilder = require('./link-builder');

/**
 * Boxed
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
class Boxed extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'boxedwholesale',
      hostname: 'boxed.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.boxed.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'boxed';
  }
}

Boxed.AppMappings = [{ match: true }];

module.exports = Boxed;
