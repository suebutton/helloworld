const {
  formatUrl,
  formatButtonUniversalUrl,
  cleanPathname,
} = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  composeMatches,
  matchHomepage,
  matchPathname,
  matchQuery,
  matchIOS,
} = require('../app-mapping');

class Tophatter extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query } = appDestination;

    return formatUrl({
      protocol: 'tophatter',
      hostname: cleanPathname(pathname),
      pathname: null,
      query,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.tophatter.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('tophatter', appDestination);
  }
}

Tophatter.AppMappings = [
  {
    match: composeMatches(
      matchHomepage,
      matchQuery({ categories: /.*/ }),
      matchIOS
    ),
    destination: {
      pathname: (match, p, d) => `live/${d.query.categories}`,
      query: {},
    },
  },
  {
    match: composeMatches(matchPathname('/catalogs'), matchIOS),
  },
  {
    match: composeMatches(matchIOS, matchHomepage),
  },
];

module.exports = Tophatter;
