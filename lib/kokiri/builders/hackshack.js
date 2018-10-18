const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * HackShack
 *
 * This is a fake, internal merchant for use in Button Publisher SDK QA.
 */
class HackShack extends LinkBuilder {
  getAppLink(appDestination) {
    const { hostname, pathname, query } = appDestination;

    return formatUrl({
      protocol: 'hackshack',
      hostname,
      pathname,
      query,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'hackshack.app',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('hackshack', appDestination);
  }
}

module.exports = HackShack;
