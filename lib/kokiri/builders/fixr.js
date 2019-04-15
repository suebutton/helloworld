const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

class Fixr extends LinkBuilder {

  getAppLink(appDestination) {
    const { hostname, pathname, query } = appDestination;

    return formatUrl({
      protocol: 'fixr',
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
      hostname: 'www.fixr.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

 getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('fixr', appDestination);
  }
}

Fixr.AppMappings = [{ match: matchHomepage }];

module.exports = Fixr;
