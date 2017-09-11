const { get, extend } = require('lodash');

const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Poshmark
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
class Poshmark extends LinkBuilder {
  query() {
    return {
      utm_source: get(Poshmark.utmSourceMap, this.publisherId, 'button'),
    };
  }

  getAppLink() {
    return formatUrl({
      protocol: 'poshmark',
      hostname: null,
      pathname: null,
      query: this.query(),
      hash: null,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.poshmark.com',
      pathname,
      query: extend({}, query, this.query()),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return null;
  }
}

Poshmark.utmSourceMap = {
  'org-2d432a88b9bb8bda': 'ibotta',
};

Poshmark.AppMappings = [{ match: matchHomepage }];

module.exports = Poshmark;
