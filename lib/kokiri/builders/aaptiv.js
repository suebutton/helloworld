const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

class Aaptiv extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol: 'skyfit',
      hostname: 'aaptiv.com',
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.aaptiv.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('aaptiv', appDestination);
  }
}

Aaptiv.AppMappings = [{ match: matchHomepage }];

module.exports = Aaptiv;
