const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

class Vividseats extends LinkBuilder {
  getAppLink(appDestination) {
    const { hostname, pathname, query } = appDestination;

    return formatUrl({
      protocol: 'vividseats',
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
      hostname: 'www.vividseats.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('vividseats', appDestination);
  }
}

Vividseats.AppMappings = [{ match: matchHomepage }];

module.exports = Vividseats;
