const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

class Drizly extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'drizly',
      hostname: pathname,
      pathname: null,
      query,
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.drizly.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('drizly', appDestination);
  }
}

Drizly.AppMappings = [
  {
    match: matchPathname('/:slug/p:id([0-9]+)/(.*)?'),
    destination: {
      pathname: match => `catalog_item/p${match.id}`,
    },
  },
  {
    match: matchPathname('/:slug/c:id([0-9]+)/(.*)?'),
    destination: {
      pathname: match => `category/c${match.id}`,
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Drizly;
