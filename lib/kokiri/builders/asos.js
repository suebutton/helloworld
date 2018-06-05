const { isString, merge } = require('lodash');
const LinkBuilder = require('./link-builder');
const { formatUrl, joinPathname } = require('../lib');
const { matchHomepage } = require('../app-mapping');

/**
 * ASOS
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

const LOCALE_NAME = 'locale';

class Asos extends LinkBuilder {
  locale(destination) {
    const { pathname } = destination;
    /* The below safeguards for links passed by publishers
    like "asos.com/us/men/" so that we don't generate incorrect links
    like "asos.com/us/us/men".
    */
    if (isString(pathname) && pathname.split('/')[1] === 'us') {
      return '';
    }
    return this.getPartnerValue(LOCALE_NAME, '');
  }

  query(destination) {
    return merge({}, destination.query, {
      affid: '20578',
    });
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'asos',
      hostname: 'home',
      pathname,
      query: this.query(appDestination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'http',
      hostname: 'm.asos.com',
      pathname: joinPathname([this.locale(destination), pathname]),
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }
}

Asos.AppMappings = [
  {
    match: matchHomepage,
  },
];

module.exports = Asos;
