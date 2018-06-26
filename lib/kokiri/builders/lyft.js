const { formatUrl, formatButtonUniversalUrl } = require('../lib');

const { matchHomepage } = require('../app-mapping');

const LinkBuilder = require('./link-builder');

/**
 * Lyft
 *
 * Supports App links only at this time
 * Deep-link Support:
 * 1. Homepage
 *
 */
class Lyft extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;
    return formatUrl({
      protocol: 'lyft',
      hostname: pathname,
      pathname: null,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('lyft', appDestination);
  }
}

Lyft.AppMappings = [
  {
    match: matchHomepage,
    destination: {
      pathname: 'button',
    },
  },
];

Lyft.UniversalMappings = [
  {
    match: matchHomepage,
    destination: {
      pathname: 'button',
    },
  },
];

module.exports = Lyft;
