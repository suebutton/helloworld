const { merge, extend } = require('lodash');

const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

/**
 * Walmart
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
class Walmart extends LinkBuilder {
  query(destination, attributionToken) {
    return extend({}, destination.query, {
      sourceid: `button-attribution-token--${attributionToken}`,
      wmlspartner: 'btnntwk',
      affcmpid: '2030436372',
      tmode: '0000',
      veh: 'aff',
    });
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'walmart',
      hostname: pathname,
      pathname: null,
      query: this.query(appDestination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.walmart.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'walmart';
  }

  getUniversalLinkDestination(appDestination, platform, attributionToken) {
    return merge({}, appDestination, {
      query: this.query(appDestination, attributionToken),
    });
  }
}

Walmart.AppMappings = [
  {
    match: matchPathname(/^\/?ip\/(?:[^/]+\/)?(\w+)(?:\/.*)?$/, ['productId']),
    destination: {
      pathname: match => `ip/${match.productId}`,
    },
  },
  {
    match: matchPathname(/^\/?cp\/[^/]+\/([0-9]+)(?:\/.*)?$/, ['categoryId']),
    destination: {
      pathname: match => `search-department/${match.categoryId}`,
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Walmart;
