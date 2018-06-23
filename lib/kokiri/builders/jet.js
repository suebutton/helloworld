const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  matchPathname,
  matchHomepage,
  composeMatches,
  matchIOS,
  matchAndroid,
} = require('../app-mapping');

/**
 * Jet
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
class Jet extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'jet',
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
      hostname: 'www.jet.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('jet', appDestination);
  }
}

const matchProductPage = matchPathname(
  '/product/:slug?/:productId(\\w{32})/(.*)?'
);

const matchSearchPage = matchPathname('/search/(.*)?');

const matchUniquelyJPage = matchPathname('/shop/uniquelyj');

Jet.AppMappings = [
  {
    match: composeMatches(matchProductPage, matchIOS),
    destination: {
      pathname: match => `jet.com/product/product/${match.productId}`,
    },
  },
  {
    match: composeMatches(matchProductPage, matchAndroid),
    destination: {
      pathname: match => `product/product/${match.productId}`,
    },
  },
  {
    match: composeMatches(matchSearchPage, matchIOS),
    destination: {
      pathname: 'jet.com/search',
    },
  },
  {
    match: composeMatches(matchSearchPage, matchAndroid),
    destination: {
      pathname: 'search',
    },
  },
  {
    match: matchUniquelyJPage,
    destination: {
      pathname: `shop/uniquelyj`,
    },
  },
  {
    match: composeMatches(matchHomepage, matchIOS),
    destination: {
      pathname: 'home',
    },
  },
  {
    match: composeMatches(matchHomepage, matchAndroid),
    destination: {
      pathname: 'open',
    },
  },
];

Jet.UniversalMappings = [
  {
    match: composeMatches(matchProductPage, matchIOS),
    destination: {
      pathname: match => `product/product/${match.productId}`,
    },
  },
  {
    match: composeMatches(matchHomepage, matchIOS),
    destination: {
      pathname: 'home',
    },
  },
  {
    match: matchIOS,
  },
  {
    match: composeMatches(matchHomepage, matchAndroid),
    destination: {
      pathname: 'landing',
    },
  },
];

module.exports = Jet;
