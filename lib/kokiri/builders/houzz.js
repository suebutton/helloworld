const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchIOS, matchAndroid } = require('../app-mapping');
const { FALLBACK_WEB, FALLBACK_PARAM } = require('../../constants');

class Houzz extends LinkBuilder {
  getAppLink(appDestination) {
    const { hostname, pathname, query } = appDestination;

    return formatUrl({
      protocol: 'houzz',
      hostname,
      pathname,
      query,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.houzz.com',
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
