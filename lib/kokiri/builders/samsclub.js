const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  matchHomepage,
  matchPathname,
  composeMatches,
  matchAndroid,
} = require('../app-mapping');

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
    match: composeMatches(matchHomepage, matchAndroid),
    destination: {
      pathname: 'home',
    },
  },
  {
    match: composeMatches(
      matchPathname('/sams/:slug/:categoryId([0-9]+).cp'),
      matchAndroid
    ),
    destination: {
      pathname: 'category',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ id: match.categoryId },
      }),
    },
  },
  {
    match: composeMatches(
      matchPathname('/sams/:slug/:productId(prod[0-9]+).ip'),
      matchAndroid
    ),
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
