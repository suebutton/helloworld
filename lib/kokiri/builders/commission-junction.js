const { parseUrl, formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * Commission Junction
 *
 * Supports the following destination object:
 *
 *  // TODO: what is this documentation supposed to contain
 *
 * {
 *   url
 * }
 *
 */
class CommissionJunction extends LinkBuilder {
  getBrowserLink(destination, attributionToken) {
    let { url } = destination;

    const { pathname } = parseUrl(url);

    const merchantUrl = this.mapMerchantIdToUrl();
    if (merchantUrl !== null) {
      url = `${merchantUrl}${pathname}`;
    }

    const cjMerchantId = this.mapMerchantIdToCJMerchantId();
    if (cjMerchantId === null) {
      return null;
    }

    const cjPublisherId = this.mapPublisherIdToCJPublisherId();

    const query = {
      sid: attributionToken,
      url,
    };
    return formatUrl({
      protocol: 'http',
      hostname: 'www.dpbolvw.net',
      pathname: `click-${cjPublisherId}-${cjMerchantId}`,
      query,
      slashes: true,
    });
  }

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

CommissionJunction.PublisherIdMap = {};

module.exports = CommissionJunction;
