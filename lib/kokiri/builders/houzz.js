const {
  formatUrl,
  formatButtonUniversalUrl,
  normalizeHostname,
} = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchIOS, matchAndroid } = require('../app-mapping');
const { FALLBACK_WEB, FALLBACK_PARAM } = require('../../constants');

const HOSTNAME_WHITELIST = new Set(['houzz.com', 'houzz.co.uk']);
const REF_ID_NAME = 'refid';
const REF_ID_FALLBACK = 'us-ptr-mpl-btn-0000';

class Houzz extends LinkBuilder {
  refId() {
    return this.getPartnerValue(REF_ID_NAME, REF_ID_FALLBACK);
  }

  query(destination) {
    return {
      ...destination.query,
      refid: this.refId(),
    };
  }

  hostname(destination) {
    const { hostname } = destination;

    return HOSTNAME_WHITELIST.has(normalizeHostname(hostname))
      ? hostname
      : 'www.houzz.com';
  }

  getAppLink(appDestination) {
    const { pathname } = appDestination;

    return formatUrl({
      protocol: 'houzz',
      hostname: pathname,
      pathname: null,
      query: this.query(appDestination),
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: this.hostname(destination),
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, hash } = appDestination;
    const queryWithFallback = {
      ...this.query(appDestination),
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
