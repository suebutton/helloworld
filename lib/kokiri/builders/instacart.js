const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  matchPathname,
  matchHomepage,
  composeMatches,
  matchIOS,
  matchAndroid,
} = require('../app-mapping');

/**
 * Instacart
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
class Instacart extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'instacart',
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
      hostname: 'www.instacart.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }
}

const matchGrocerPage = matchPathname('/store/:grocer_slug');

const matchSearchPage = matchPathname('/store/:grocer_slug/search_v3/(.*)?');

Instacart.AppMappings = [
  {
    match: composeMatches(matchGrocerPage, matchIOS),
    destination: {
      pathname: 'store',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ retailer_slug: match.grocer_slug },
      }),
    },
  },
  {
    match: composeMatches(matchGrocerPage, matchAndroid),
    destination: {
      pathname: match => `store/${match.grocer_slug}`,
    },
  },
  {
    match: composeMatches(matchSearchPage, matchIOS),
    destination: {
      pathname: 'search',
      query: (match, prevQuery) => ({ ...prevQuery, ...{ q: match[0] } }),
    },
  },
  {
    match: composeMatches(matchSearchPage, matchAndroid),
    destination: {
      pathname: 'search',
      query: (match, prevQuery) => ({ ...prevQuery, ...{ query: match[0] } }),
    },
  },
  {
    match: matchHomepage,
  },
];

Instacart.UniversalMappings = Instacart.AppMappings;

module.exports = Instacart;
