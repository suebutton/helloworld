const { merge, pick } = require('lodash');
const { parseUrl, formatUrl, cleanPathname } = require('../lib');

const LinkBuilder = require('./link-builder');

/**
 * Uber
 *
 * Supports the following destination object:
 *
 * {
 *   hostname,
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

  getBrowserLink(destination) {
    const { hostname, pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: hostname || 'www.uber.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getUniversalLinkDestination(destination) {
    return merge({}, destination, { query: { btn_fallback_exp: 'appstore' } });
  }

  getDestinationFromUrl(url) {
    return pick(parseUrl(url), ['hostname', 'pathname', 'query', 'hash']);
  }
}

Uber.KnownMappings = [{ match: true }];

module.exports = Uber;
