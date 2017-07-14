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
      pub: '5575211063',
      campid: '5337936547',
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

  getUniversalLinkDestination(destination, attributionToken) {
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

Ebay.KnownMappings = [
  {
    match: matchHomepage,
  },
];

module.exports = Ebay;
