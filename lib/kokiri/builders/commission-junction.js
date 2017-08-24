const { formatUrl, attributeQuery } = require('../lib');
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
    const { url } = destination;

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

CommissionJunction.MerchantIdMap = {
  // Gap staging
  'org-319e4a77607c0ae6': '10410849',
  // Gap prod
  'org-10056a6c4b9f45da': '10410849',
  // QVC staging
  'org-48b55e692be2e29e': '5965867',
  // QVC prod
  'org-60b61bf43617aa3a': '5965867',
  // Stitch Fix staging
  'org-33fbd5f8fc3214c4': '12922947',
  // Stitch Fix prod
  'org-7f2a65dec2f40c6e': '12922947',
  // Express staging
  'org-3acb6dc42678c843': '11393884',
  // Express prod
  'org-1f8bb66ff44ca946': '11393884',
  // Under Armour staging
  'org-68f62bd9e3c6299d': '11360763',
  // Under Armour prod
  'org-4d6fc40af1133350': '11360763',
};

CommissionJunction.SubdomainMap = {
  // Gap staging
  'org-319e4a77607c0ae6': 'gap',
  // Gap prod
  'org-10056a6c4b9f45da': 'gap',
  // QVC staging
  'org-48b55e692be2e29e': 'qvc',
  // QVC prod
  'org-60b61bf43617aa3a': 'qvc',
  // Stitch Fix staging
  'org-33fbd5f8fc3214c4': 'stitchfix',
  // Stitch Fix prod
  'org-7f2a65dec2f40c6e': 'stitchfix',
  // Express staging
  'org-3acb6dc42678c843': 'express',
  // Express prod
  'org-1f8bb66ff44ca946': 'express',
  // Under Armour staging
  'org-68f62bd9e3c6299d': 'underarmour',
  // Under Armour prod
  'org-4d6fc40af1133350': 'underarmour',
};

CommissionJunction.PublisherIdMap = {};

module.exports = CommissionJunction;
