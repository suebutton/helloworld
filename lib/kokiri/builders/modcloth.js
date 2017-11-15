const { formatUrl } = require('../lib');

const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

/**
 * Modcloth
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
class Modcloth extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'modcloth',
      hostname: 'modcloth.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.modcloth.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'modcloth';
  }
}

Modcloth.AppMappings = [
  { match: matchPathname(/^\/?shop\/[^/]+\/?$/) },
  { match: matchPathname(/^\/?shop\/[^/]+\/[^/]+\/\d{1,}\.html\/?/) },
  { match: matchHomepage },
];

module.exports = Modcloth;
