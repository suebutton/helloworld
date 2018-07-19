const { formatUrl } = require('../lib');

const { matchPathname, matchQuery, composeMatches } = require('../app-mapping');

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
}

const matchRideTypePath = matchPathname('/ride');
const matchRideTypeId = matchQuery({ id: /^lyft[_a-z]*/ });

Lyft.AppMappings = [
  {
    match: composeMatches(matchRideTypePath, matchRideTypeId),
    destination: {
      pathname: 'ridetype',
      query: (match, prevQuery) => extend({}, prevQuery, { id: prevQuery.id }),
    },
  },
];

module.exports = Lyft;
