const { merge } = require('lodash');
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
const PID_NAME = 'pid';
const PID_FALLBACK = 'ibotta';

class Seatgeek extends LinkBuilder {
  pid() {
    return this.getPartnerValue(PID_NAME, PID_FALLBACK);
  }

  query(destination) {
    return merge({}, destination.query, {
      aid: '12408',
      pid: this.pid(),
    });
  }

  getAppLink(appDestination) {
    const { protocol, hostname, pathname, hash } = appDestination;

    return formatUrl({
      protocol,
      hostname,
      pathname,
      query: this.query(appDestination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'seatgeek.com',
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'seatgeek';
  }

  getUniversalLinkDestination(destination) {
    return merge({}, destination, { query: this.query(destination) });
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
    match: matchIOS,
    destination: {
      protocol: 'https',
      hostname: 'seatgeek.com',
    },
  },
];

module.exports = Seatgeek;
