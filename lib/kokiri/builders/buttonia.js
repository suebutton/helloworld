const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * Buttonia
 *
 * This is a fake, internal merchant for use in Button Publisher SDK QA.
 */
class Buttonia extends LinkBuilder {
  getAppLink(appDestination) {
    const { hostname, pathname, query } = appDestination;

    return formatUrl({
      protocol: 'buttonia',
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
      hostname: 'www.buttonia.co',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('buttonia', appDestination);
  }
}

module.exports = Buttonia;
