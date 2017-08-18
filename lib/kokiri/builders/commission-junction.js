const { parseUrl, formatUrl, attributeQuery } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * Commission Junction
 *
 * Supports the following destination object:
 *
 *
 * {
 *   url
 * }
 *
 */
class CommissionJunction extends LinkBuilder {
  query(destination, attributionToken) {
    let { url } = destination;

    const { pathname } = parseUrl(url);

    // for cj-drizly testing purposes only
    const merchantUrl = this.mapMerchantIdToUrl();
    if (merchantUrl !== null) {
      url = `${merchantUrl}${pathname}`;
    }

    return {
      sid: attributionToken,
      url,
    };
  }

  pathname() {
    const cjMerchantId = this.mapMerchantIdToCJMerchantId();
    if (cjMerchantId === null) {
      return null;
    }

    const cjPublisherId = this.mapPublisherIdToCJPublisherId();

    return `click-${cjPublisherId}-${cjMerchantId}`;
  }
  getBrowserLink(destination, attributionToken) {
    const pathname = this.pathname();
    if (pathname === null) {
      return null;
    }
    return formatUrl({
      protocol: 'http',
      hostname: 'www.dpbolvw.net',
      pathname,
      query: this.query(destination, attributionToken),
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return CommissionJunction.SubdomainMap[this.merchantId] || null;
  }

  getUniversalLinkDestination(destination, platform, attributionToken) {
    const query = this.query(destination, attributionToken);

    return {
      pathname: this.pathname(),
      query: attributeQuery(query, attributionToken, 'sid'),
    };
  }

  // Only for Testing CJ with Drizly
  mapMerchantIdToUrl() {
    return CommissionJunction.MerchantUrlMap[this.merchantId] || null;
  }

  mapMerchantIdToCJMerchantId() {
    return CommissionJunction.MerchantIdMap[this.merchantId] || null;
  }

  mapPublisherIdToCJPublisherId() {
    return CommissionJunction.PublisherIdMap[this.publisherId] || '8395017';
  }

  getDestinationFromUrl(url) {
    return { url };
  }
}

CommissionJunction.AppMappings = [];

// only needed for drizly cj testing
CommissionJunction.MerchantUrlMap = {
  // Drizly CJ staging
  'org-0b394cbf5a4d9aa8': 'https://drizly.com',
  // Drizly CJ prod
  'org-6bf4f2fd8a3a61d2': 'https://drizly.com',
};

CommissionJunction.MerchantIdMap = {
  // Drizly CJ staging
  'org-0b394cbf5a4d9aa8': '12515534',
  // Drizly CJ prod
  'org-6bf4f2fd8a3a61d2': '12515534',
  // Gap staging
  'org-319e4a77607c0ae6': '10410849',
  // Gap prod
  'org-10056a6c4b9f45da': '10410849',
  // QVC staging
  'org-48b55e692be2e29e': '5965867',
  // QVC prod
  'org-60b61bf43617aa3a': '5965867',
};

CommissionJunction.SubdomainMap = {
  // Drizly CJ staging
  'org-0b394cbf5a4d9aa8': 'drizly-cj',
  // Drizly CJ prod
  'org-6bf4f2fd8a3a61d2': 'drizly-cj',
  // Gap staging
  'org-319e4a77607c0ae6': 'gap',
  // Gap prod
  'org-10056a6c4b9f45da': 'gap',
  // QVC staging
  'org-48b55e692be2e29e': 'qvc',
  // QVC prod
  'org-60b61bf43617aa3a': 'qvc',
};

CommissionJunction.PublisherIdMap = {};

module.exports = CommissionJunction;
