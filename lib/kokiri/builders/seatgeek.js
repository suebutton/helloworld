const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  composeMatches,
  matchIOS,
  matchAndroid,
  matchHomepage,
} = require('../app-mapping');

/**
 * Seatgeek
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
class Seatgeek extends LinkBuilder {
  getAppLink(appDestination) {
    const { protocol, hostname, pathname, query, hash } = appDestination;

    return formatUrl({
      protocol,
      hostname,
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
      hostname: 'seatgeek.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'seatgeek';
  }
}

Seatgeek.AppMappings = [
  {
    match: composeMatches(matchHomepage, matchIOS),
    destination: {
      protocol: 'seatgeek',
      hostname: null,
    },
  },
  {
    match: composeMatches(matchHomepage, matchAndroid),
    destination: {
      protocol: 'seatgeek',
      hostname: 'app',
    },
  },
  {
    match: true,
    destination: {
      protocol: 'https',
      hostname: 'www.seatgeek.com',
    },
  },
];

module.exports = Seatgeek;
