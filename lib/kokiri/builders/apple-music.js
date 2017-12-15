const { extend } = require('lodash');
const { formatUrl } = require('../lib');

const LinkBuilder = require('./link-builder');

/**
 * AppleMusic
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
class AppleMusic extends LinkBuilder {
  query(destination, attributionToken) {
    const { query } = destination;

    const at = '1000lura';
    const mt = '1';
    const app = 'music';
    const ct = attributionToken;

    return extend({}, query, { at, mt, app, ct });
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'musics',
      hostname: 'geo.itunes.apple.com',
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
}

module.exports = AppleMusic;
