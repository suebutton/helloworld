const { formatUrl, cleanPathname } = require('../lib');
const { OS_IOS } = require('../../constants');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * OneEightHundredFlowers
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
class OneEightHundredFlowers extends LinkBuilder {
  getAppLink(appDestination, platform) {
    return formatUrl({
      protocol: platform === OS_IOS ? 'bestsellingflowers' : 'flowersbutton',
      hostname: null,
      pathname: null,
      query: null,
      hash: null,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;
    // We currently have a single URL that will affiliate with 1800 flowers.
    // Updating to make sure that only this URL is accepted. PEP-11870
    if (cleanPathname(pathname) !== 'mothers-day-best-sellers') {
      return null;
    }

    return formatUrl({
      protocol: 'https',
      hostname: 'm.www.1800flowers.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }
}

OneEightHundredFlowers.AppMappings = [{ match: matchHomepage }];

module.exports = OneEightHundredFlowers;
