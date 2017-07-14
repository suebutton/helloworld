const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

/**
 * Drizly
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

  getPartnerSubdomain() {
    return 'drizly';
  }
}

Drizly.KnownMappings = [
  {
    match: matchPathname(/^\/?[\w.-]+\/p([0-9]+)(?:\/.*)?$/, ['id']),
    destination: {
      pathname: match => `catalog_item/p${match.id}`,
    },
  },
  {
    match: matchPathname(/^\/?[\w.-]+\/c([0-9]+)(?:\/.*)?$/, ['id']),
    destination: {
      pathname: match => `category/c${match.id}`,
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Drizly;
