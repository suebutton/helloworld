const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage, matchPathname } = require('../app-mapping');

class SamsClub extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query } = appDestination;

    return formatUrl({
      protocol: 'https',
      hostname: 'app.samsclub.com',
      pathname,
      query,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'm.samsclub.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }
}

SamsClub.AppMappings = [
  {
    match: matchHomepage,
    destination: {
      pathname: 'home',
    },
  },
  {
    match: matchPathname('/sams/:slug/:categoryId([0-9]+).cp'),
    destination: {
      pathname: 'category',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ id: match.categoryId },
      }),
    },
  },
  {
    match: matchPathname('/sams/:slug/:productId(prod[0-9]+).ip'),
    destination: {
      pathname: 'product',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ id: match.productId },
      }),
    },
  },
];

module.exports = SamsClub;
