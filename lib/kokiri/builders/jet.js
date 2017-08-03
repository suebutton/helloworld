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

  getPartnerSubdomain() {
    return 'jet';
  }
}

const matchProductPage = matchPathname(
  /^\/?product\/(?:[\w-%]+\/)?(\w{32})(?:\/.*)?$/,
  ['productId']
);

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
    match: composeMatches(matchPathname(/^\/?search(?:\/.*)?$/), matchIOS),
    destination: {
      pathname: 'jet.com/search',
    },
  },
  {
    match: composeMatches(matchPathname(/^\/?search(?:\/.*)?$/), matchAndroid),
    destination: {
      pathname: 'search',
    },
  },
  {
    match: matchHomepage,
    destination: {
      pathname: 'home',
    },
  },
];

module.exports = Jet;
