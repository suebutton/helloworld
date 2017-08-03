const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * LinkShare
 *
 * Supports the following destination object:
 *
 * {
 *   url
 * }
 *
 */
class LinkShare extends LinkBuilder {
  getBrowserLink(destination, attributionToken) {
    const { url } = destination;
    if (!url) {
      return null;
    }
    const mid = this.mapLinkShareMerchantId();
    if (mid === null) {
      return null;
    }
    const query = { id: 'BLquFtB2nfI', mid, murl: url, u1: attributionToken };
    return formatUrl({
      protocol: 'https',
      hostname: 'click.linksynergy.com',
      pathname: 'deeplink',
      query,
      slashes: true,
    });
  }
  getDestinationFromUrl(url) {
    return { url };
  }
  mapLinkShareMerchantId() {
    return LinkShare.MerchantIDMap[this.merchantId] || null;
  }
}

LinkShare.AppMappings = [{ match: false }];
LinkShare.MerchantIDMap = {
  'org-7cee09c599d0f13c': '38275', // TechArmor
  'org-6ef589c578ab8ac6': '38275', // TechArmor Staging
};
module.exports = LinkShare;
