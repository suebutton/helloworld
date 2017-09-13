const { extend } = require('lodash');

const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Ebags
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
class Ebags extends LinkBuilder {
  query() {
    return {
      sourceid: 'BTNIB',
      btnpid: this.publisherId,
      utm_source: 'button',
      utm_medium: 'affiliate',
    };
  }

  getAppLink() {
    return null;
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.ebags.com',
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

Ebags.AppMappings = [{ match: matchHomepage }];

module.exports = Ebags;
