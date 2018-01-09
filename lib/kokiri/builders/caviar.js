const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

/**
 * Caviar
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
class Caviar extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'caviar-app',
      hostname: '',
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
      hostname: 'www.trycaviar.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'caviar';
  }
}

Caviar.AppMappings = [
  {
    match: matchPathname('/:city/:slug-:id([0-9]+)'),
    destination: {
      pathname: match => `merchant/${match.id}`,
    },
  },
  {
    match: matchHomepage,
  },
];

Caviar.UniversalMappings = Caviar.AppMappings;

module.exports = Caviar;
