const { extend } = require('lodash');

const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

/**
 * Atom
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
class Atom extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'atom',
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
      hostname: 'www.atomtickets.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'atomtickets';
  }
}

Atom.AppMappings = [
  {
    match: matchPathname(/^\/?movies\/[\w.-]+\/([0-9]+)(?:\/.*)?$/, ['id']),
    destination: {
      pathname: '/ViewProductionDetails',
      query: (match, prevQuery) =>
        extend({}, prevQuery, { productionId: match.id }),
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Atom;
