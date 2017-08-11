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
    const { url } = destination;

    const { pathname } = parseUrl(url);

    const merchantUrl = this.mapMerchantIdToUrl();
    if (merchantUrl === null) {
      return null;
    }

    const cjMerchantId = this.mapMerchantIdToCJMerchantId();
    if (cjMerchantId === null) {
      return null;
    }

    const cjPublisherId = this.mapPublisherIdToCJPublisherId();

    const query = {
      sid: attributionToken,
      url: `${merchantUrl}${pathname}`,
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
};

CommissionJunction.PublisherIdMap = {};

module.exports = CommissionJunction;
