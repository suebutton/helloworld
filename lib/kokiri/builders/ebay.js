const { get, omit } = require('lodash');

const { parseUrl, formatUrl, attributeQuery } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Ebay
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
class Ebay extends LinkBuilder {
  pub() {
    return get(Ebay.pubTokenMap, this.publisherId, '5575211063');
  }

  campid() {
    return get(Ebay.campidTokenMap, this.publisherId, '5337936547');
  }

  redirectUrl(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'http',
      hostname: 'www.ebay.com',
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

  getAppLink(appDestination, platform, attributionToken) {
    const { hash } = appDestination;

    return formatUrl({
      protocol: 'ebay',
      hostname: 'rover.ebay.com',
      pathname: '/1/711-53200-19255-0/1',
      query: this.query(appDestination, attributionToken),
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
      return super.getDestinationFromUrl(get(query, 'mpre', url));
    }

    return super.getDestinationFromUrl(url);
  }

  getUniversalLinkDestination(destination, platform, attributionToken) {
    const query = this.query(destination, attributionToken);

    return {
      pathname: '/rover/1/711-53200-19255-0/1',
      query: attributeQuery(query, attributionToken, 'customid'),
    };
  }

  getPartnerSubdomain() {
    return 'ebay';
  }
}

Ebay.AppMappings = [
  {
    match: matchHomepage,
  },
];

Ebay.pubTokenMap = {
  'org-2d432a88b9bb8bda': '5575211063', // Ibotta
  'org-030575eddb72b4df': '5575309782', // Shopkick
  'org-2ea10c94f3f5badc': '5575334827', // Slickdeals
  'org-1443446d6738e5bc': '5575324531', // Shopsavvy
};

Ebay.campidTokenMap = {
  'org-2d432a88b9bb8bda': '5337936547', // Ibotta
  'org-030575eddb72b4df': '5338106664', // Shopkick
  'org-2ea10c94f3f5badc': '5338188809', // Slickdeals
  'org-1443446d6738e5bc': '5338170171', // Shopsavvy
};

module.exports = Ebay;
