const {
  formatUrl,
  formatButtonUniversalUrl,
  normalizeHostname,
} = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchIOS, matchAndroid } = require('../app-mapping');
const { FALLBACK_WEB, FALLBACK_PARAM } = require('../../constants');

const HOSTNAME_WHITELIST = new Set(['houzz.com', 'houzz.co.uk']);

class Houzz extends LinkBuilder {
  hostname(destination) {
    const { hostname } = destination;

    return HOSTNAME_WHITELIST.has(normalizeHostname(hostname))
      ? hostname
      : 'www.houzz.com';
  }

  getAppLink(appDestination) {
    const { pathname, query } = appDestination;

    return formatUrl({
      protocol: 'houzz',
      hostname: pathname,
      pathname: null,
      query,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: this.hostname(destination),
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, query, hash } = appDestination;
    const queryWithFallback = {
      ...query,
      [FALLBACK_PARAM]: FALLBACK_WEB,
    };

    return formatButtonUniversalUrl('houzz', {
      pathname,
      query: queryWithFallback,
      hash,
    });
  }
}

Houzz.AppMappings = [{ match: matchIOS }, { match: matchAndroid }];

module.exports = Houzz;
