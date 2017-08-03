const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

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
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'walmart',
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
      hostname: 'www.walmart.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'walmart';
  }
}

Walmart.AppMappings = [
  {
    match: matchPathname(/^\/?ip\/(?:[\w-%]+\/)?(\w{8})(?:\/.*)?$/, [
      'productId',
    ]),
    destination: {
      pathname: match => `ip/${match.productId}`,
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Walmart;
