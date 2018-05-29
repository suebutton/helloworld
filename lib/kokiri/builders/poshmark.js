const { extend } = require('lodash');

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
const UTM_SOURCE_NAME = 'utm_source';
const UTM_SOURCE_FALLBACK = 'button';

class Poshmark extends LinkBuilder {
  utmSource() {
    return this.getPartnerValue(UTM_SOURCE_NAME, UTM_SOURCE_FALLBACK);
  }

  query() {
    return { utm_source: this.utmSource() };
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
}

Poshmark.AppMappings = [{ match: matchHomepage }];

module.exports = Poshmark;
