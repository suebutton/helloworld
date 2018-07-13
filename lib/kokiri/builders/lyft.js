const { formatUrl, formatButtonUniversalUrl } = require('../lib');

const { matchHomepage, matchQuery } = require('../app-mapping');

const LinkBuilder = require('./link-builder');

const { extend } = require('lodash');

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

  getBrowserLink(destination) {
    const { hash, query } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.lyft.com',
      pathname: 'ride',
      query: extend({}, query, { id: 'lyft' }),
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
    match: matchQuery({ id: /^lyft\w*/ }),
    destination: {
      pathname: 'ridetype',
      query: (match, prevQuery) => extend({}, prevQuery, { id: prevQuery.id }),
    },
  },
  {
    match: matchHomepage,
  },
];

Lyft.UniversalMappings = Lyft.AppMappings;

module.exports = Lyft;
