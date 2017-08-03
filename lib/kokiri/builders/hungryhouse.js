const { formatUrl } = require('../lib');

const LinkBuilder = require('./link-builder');

/**
 * Hungryhouse
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
class Hungryhouse extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'hungryhouse',
      hostname: 'hungryhouse.co.uk',
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
      hostname: 'www.hungryhouse.co.uk',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'hungryhouse';
  }
}

Hungryhouse.AppMappings = [{ match: true }];

module.exports = Hungryhouse;
