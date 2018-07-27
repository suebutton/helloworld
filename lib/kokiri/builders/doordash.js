const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * DoorDash
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
class DoorDash extends LinkBuilder {
  query(destination) {
    return { ...destination.query, ...{ ignore_splash_experience: 'true' } };
  }

  getAppLink() {
    return formatUrl({
      protocol: 'doordash',
      hostname: 'doordash.com',
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.doordash.com',
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('doordash', appDestination);
  }
}

DoorDash.AppMappings = [{ match: matchHomepage }];

module.exports = DoorDash;
