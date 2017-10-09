const { formatUrl, cleanPathname } = require('../lib');

const LinkBuilder = require('./link-builder');

/**
 * Uber
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
class Uber extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'uber',
      hostname: cleanPathname(pathname),
      pathname: '',
      query,
      hash,
      slashes: true,
    });
  }

  getBrowserLink() {
    return null;
  }

  getPartnerSubdomain() {
    return 'uberm';
  }
}

Uber.AppMappings = [{ match: true }];

module.exports = Uber;
