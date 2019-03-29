// 2019-03-29 This builder has not been tested for affiliation and attribution accuracy
// and will be re-validated prior to launch in PEP-14219

const { formatUrl, cleanPathname } = require('../lib');

const LinkBuilder = require('./link-builder');

const {
  composeMatches,
  matchPathname,
  matchHomepage,
  matchQuery,
} = require('../app-mapping');

class WalmartGrocery extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'walmart-grocery',
      hostname: cleanPathname(pathname),
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
      hostname: 'grocery.walmart.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }
}

WalmartGrocery.AppMappings = [
  {
    match: matchPathname('/ip/:productSlug?/:productId/(.*)?'),
  },
  {
    match: composeMatches(
      matchPathname('/products'),
      matchQuery({ query: /.*/ })
    ),
  },
  {
    match: matchHomepage,
  },
];

module.exports = WalmartGrocery;
