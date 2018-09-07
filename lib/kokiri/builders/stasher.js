const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * Stasher
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
class Stasher extends LinkBuilder {
  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'stasher.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }
}

module.exports = Stasher;
