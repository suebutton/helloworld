const { merge } = require('lodash');
const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchIOS, matchHomepage } = require('../app-mapping');

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
const PID_FALLBACK = 'button';

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

  getButtonUniversalLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatButtonUniversalUrl('seatgeek', {
      pathname,
      query: this.query(appDestination),
      hash,
    });
  }
}

Seatgeek.AppMappings = [
  {
    match: matchHomepage,
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
