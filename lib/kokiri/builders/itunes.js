const { extend } = require('lodash');
const { formatUrl } = require('../lib');
const { matchIOS } = require('../app-mapping');

const LinkBuilder = require('./link-builder');

/**
 * Itunes
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
class Itunes extends LinkBuilder {
  query(destination, attributionToken) {
    const { query } = destination;

    const at = '1000lquK';
    const mt = '1';
    const app = 'itunes';
    const ct = attributionToken;

    return extend({}, query, { at, mt, app, ct });
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'itms',
      hostname: 'itunes.apple.com',
      pathname,
      query: this.query(appDestination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'itunes.apple.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return null;
  }
}

Itunes.AppMappings = [{ match: matchIOS }];

module.exports = Itunes;
