const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Overstock
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

const BTN_AFF_NAME = 'btn_aff';
const BTN_AFF_FALLBACK = 'Button';

class Overstock extends LinkBuilder {
  btnaff() {
    return this.getPartnerValue(BTN_AFF_NAME, BTN_AFF_FALLBACK);
  }

  query() {
    return { CID: '260521', btn_aff: this.btnaff() };
  }

  appQuery() {
    return { PID: '12345', AID: '55555', affproviderId: '4', ...this.query() };
  }

  browserQuery(attributionToken) {
    return { siteId: '4', SID: attributionToken, ...this.query() };
  }

  getAppLink(appDestination) {
    const { pathname } = appDestination;

    return formatUrl({
      protocol: 'ostk',
      hostname: 'www.overstock.com',
      pathname,
      query: this.appQuery(),
      hash: null,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.overstock.com',
      pathname,
      query: { ...query, ...this.browserQuery(attributionToken) },
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatButtonUniversalUrl('overstock', {
      pathname,
      query: this.appQuery(),
      hash,
    });
  }
}

Overstock.AppMappings = [
  {
    match: matchHomepage,
    destination: { pathname: 'home' },
  },
];

Overstock.UniversalMappings = Overstock.AppMappings;

module.exports = Overstock;
