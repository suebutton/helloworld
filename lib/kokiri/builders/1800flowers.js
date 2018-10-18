const { formatUrl } = require('../lib');
const { OS_IOS } = require('../../constants');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

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
    const { query, hash } = destination;

    // We currently have a single URL that will affiliate with 1800 flowers -
    // always route there.  Updating to make sure that only this URL is
    // accepted. PEP-11870
    return formatUrl({
      protocol: 'https',
      hostname: 'm.www.1800flowers.com',
      pathname: 'mothers-day-best-sellers',
      query,
      hash,
      slashes: true,
    });
  }
}

OneEightHundredFlowers.AppMappings = [{ match: matchHomepage }];

module.exports = OneEightHundredFlowers;
