const { extend } = require('lodash');

const { formatUrl } = require('../lib');
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
    return extend(
      {},
      { PID: '12345', AID: '55555', affproviderId: '4' },
      this.query()
    );
  }

  browserQuery(attributionToken) {
    return extend({}, { siteId: '4', SID: attributionToken }, this.query());
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
      query: extend({}, query, this.browserQuery(attributionToken)),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'overstock';
  }

  getUniversalLinkDestination(appDestination) {
    return extend({}, appDestination, { query: this.appQuery() });
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
