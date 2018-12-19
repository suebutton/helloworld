const { formatUrl } = require('../lib');
const { OS_IOS } = require('../../constants');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

const SUPPORTED_PATHNAMES_ON_WEB = new Set(['/christmasflowers']);

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
    return formatUrl({
      protocol: 'https',
      hostname: 'm.www.1800flowers.com',
      pathname: SUPPORTED_PATHNAMES_ON_WEB.has(pathname) ? pathname : null,
      query,
      hash,
      slashes: true,
    });
  }
}

OneEightHundredFlowers.AppMappings = [{ match: matchHomepage }];

module.exports = OneEightHundredFlowers;
