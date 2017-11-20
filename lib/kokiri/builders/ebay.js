const { get, omit, extend } = require('lodash');

const { parseUrl, formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage, matchPathname } = require('../app-mapping');

/**
 * Ebay
 *
 * Supports the following destination object:
 *
 * {
 *   hostname,
 *   pathname,
 *   query,
 *   hash
 * }
 *
 */

const PUB_NAME = 'pub';
const PUB_FALLBACK = '5575211063';
const CAMP_ID_NAME = 'campid';
const CAMP_ID_FALLBACK = '5337936547';

class Ebay extends LinkBuilder {
  pub() {
    return this.getPartnerValue(PUB_NAME, PUB_FALLBACK);
  }

  campid() {
    return this.getPartnerValue(CAMP_ID_NAME, CAMP_ID_FALLBACK);
  }

  redirectHostname(destination) {
    const { hostname } = destination;
    return hostname || 'www.ebay.com';
  }

  redirectUrl(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'http',
      hostname: this.redirectHostname(destination),
      pathname,
      query: omit(query, ['ff3', 'toolid', 'pub', 'campid', 'customid']),
      hash,
      slashes: true,
    });
  }

  query(destination, attributionToken) {
    return {
      ff3: '4',
      toolid: '11800',
      pub: this.pub(),
      campid: this.campid(),
      customid: attributionToken,
      mpre: this.redirectUrl(destination),
    };
  }

  appQuery(appDestination, attributionToken, destination) {
    return extend({}, appDestination.query, {
      referrer: this.getBrowserLink(destination, attributionToken),
    });
  }

  getAppLink(appDestination, platform, attributionToken, destination) {
    const { hash } = appDestination;

    return formatUrl({
      protocol: 'ebay',
      hostname: 'link',
      pathname: null,
      query: this.appQuery(appDestination, attributionToken, destination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    return formatUrl({
      protocol: 'https',
      hostname: 'rover.ebay.com',
      pathname: '/rover/1/711-53200-19255-0/1',
      query: this.query(destination, attributionToken),
      slashes: true,
    });
  }

  getDestinationFromUrl(url) {
    const { hostname, query } = parseUrl(url);

    if (hostname === 'rover.ebay.com') {
      const targetUrl = get(
        query,
        'mpre',
        get(query, 'amp;mpre', 'https://ebay.com')
      );
      return this.getDestinationFromUrl(targetUrl);
    }

    return extend({}, super.getDestinationFromUrl(url), { hostname });
  }

  getPartnerSubdomain() {
    return null;
  }
}

Ebay.AppMappings = [
  {
    match: matchPathname(/^\/?ctg(?:\/[^/]+)?\/(\d+)\/?$/, ['productId']),
    destination: {
      query: match => ({ nav: 'item.product', epid: match.productId }),
    },
  },
  {
    match: matchPathname(/^\/itm(?:\/[^/]+)?\/(\d+)\/?$/, ['itemId']),
    destination: {
      query: match => ({ nav: 'item.view', id: match.itemId }),
    },
  },
  {
    match: matchHomepage,
    destination: {
      query: { nav: 'home' },
    },
  },
];

module.exports = Ebay;
