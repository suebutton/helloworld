const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  composeMatches,
  matchPathname,
  matchHomepage,
  matchAndroid,
  matchIOS,
} = require('../app-mapping');

/**
 * Walmart
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
class Walmart extends LinkBuilder {
  query(destination, attributionToken) {
    return {
      ...destination.query,
      ...{
        sourceid: `button-attribution-token--${attributionToken}`,
        wmlspartner: 'btnntwk',
        affcmpid: '2030436372',
        tmode: '0000',
        veh: 'aff',
      },
    };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'walmart',
      hostname: pathname,
      pathname: null,
      query: this.query(appDestination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.walmart.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatButtonUniversalUrl('walmart', {
      pathname,
      query: this.query(appDestination, attributionToken),
      hash,
    });
  }
}

Walmart.AppMappings = [
  {
    match: matchPathname('/ip/:slug?/:productId/(.*)?'),
    destination: {
      pathname: match => `ip/${match.productId}`,
    },
  },
  {
    match: matchPathname('/cp/:slug/:categoryId([0-9]+)'),
    destination: {
      pathname: match => `search-department/${match.categoryId}`,
    },
  },
  {
    match: composeMatches(matchHomepage, matchAndroid),
    destination: {
      pathname: 'home',
    },
  },
  {
    match: matchHomepage,
  },
];

Walmart.UniversalMappings = [
  {
    match: matchIOS,
    destination: null,
  },
  {
    match: composeMatches(
      matchPathname('/cp/:slug/:categoryId([0-9]+)'),
      matchAndroid
    ),
    destination: { pathname: 'home' },
  },
  {
    match: composeMatches(matchHomepage, matchAndroid),
    destination: { pathname: 'home' },
  },
  {
    match: true,
  },
];

Walmart.BrowserMappings = [
  {
    match: composeMatches(matchIOS, matchHomepage),
    destination: { pathname: '/home' },
  },
  {
    match: true,
  },
];

module.exports = Walmart;
