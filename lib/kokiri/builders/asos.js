const { get, merge } = require('lodash');
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

class Asos extends LinkBuilder {
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

  mapLocale() {
    return get(Asos.LocaleMap, this.publisherId);
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'http',
      hostname: 'm.asos.com',
      pathname: joinPathname([this.mapLocale(), pathname]),
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }
}

Asos.LocaleMap = {
  'org-2d432a88b9bb8bda': 'us',
  'org-030575eddb72b4df': 'us',
  'org-0ae7f03a3ad7f664': 'us',
  'org-6542eb309a6a39be': 'us',
  'org-4738195f8e741d19': 'us',
  'org-53d10c4742add983': 'us',
  'org-63cd58a1a2a8b543': 'us',
};

Asos.AppMappings = [
  {
    match: matchHomepage,
  },
];

module.exports = Asos;
