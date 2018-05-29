const { matchAndroid } = require('../app-mapping');
const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * Ticketmaster
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
class Ticketmaster extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'ticketmaster',
      hostname: null,
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('ticketmaster', appDestination);
  }
}

Ticketmaster.AppMappings = [
  {
    match: matchAndroid,
    destination: { pathname: null, query: null, hash: null },
  },
  { match: true },
];

module.exports = Ticketmaster;
