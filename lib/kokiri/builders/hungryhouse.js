const { extend } = require('lodash');

const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const { OS_IOS, FALLBACK_WEB, FALLBACK_PARAM } = require('../../constants');
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

  getButtonUniversalLink(appDestination, platform) {
    const { pathname, query, hash } = appDestination;

    const queryWithFallback =
      platform === OS_IOS
        ? extend({}, query, { [FALLBACK_PARAM]: FALLBACK_WEB })
        : query;

    return formatButtonUniversalUrl('hungryhouse', {
      pathname,
      query: queryWithFallback,
      hash,
    });
  }
}

Hungryhouse.AppMappings = [{ match: true }];

module.exports = Hungryhouse;
