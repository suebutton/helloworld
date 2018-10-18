const { extend } = require('lodash');

const { formatUrl } = require('../lib');
const { matchPathname, matchQuery, composeMatches } = require('../app-mapping');
const LinkBuilder = require('./link-builder');

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
const matchRideTypeId = matchQuery({ id: /^lyft(?:_[a-z]+)?$/ });

Lyft.AppMappings = [
  {
    match: composeMatches(matchRideTypePath, matchRideTypeId),
    destination: {
      pathname: 'ridetype',
      query: (match, prevQuery) => extend({}, prevQuery, { id: prevQuery.id }),
    },
  },
  {
    match: true,
    destination: { pathname: '/' },
  },
];

module.exports = Lyft;
