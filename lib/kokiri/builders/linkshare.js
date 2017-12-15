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
  mapLinkShareMerchantId() {
    return LinkShare.MerchantIDMap[this.merchantId] || null;
  }

  query(destination, attributionToken) {
    const { url } = destination;
    const mid = this.mapLinkShareMerchantId();

    return { id: 'BLquFtB2nfI', mid, murl: url, u1: attributionToken };
  }

  getBrowserLink(destination, attributionToken) {
    const mid = this.mapLinkShareMerchantId();

    if (mid === null) {
      return null;
    }

    return formatUrl({
      protocol: 'https',
      hostname: 'click.linksynergy.com',
      pathname: 'deeplink',
      query: this.query(destination, attributionToken),
      slashes: true,
    });
  }

  getDestinationFromUrl(url) {
    return { url };
  }
}

LinkShare.AppMappings = [];

LinkShare.MerchantIDMap = {
  'org-7cee09c599d0f13c': '38275', // TechArmor
  'org-6ef589c578ab8ac6': '38275', // TechArmor Staging
  'org-0c642216a15a1f95': '24348', // Gamestop
  'org-139f1edad7388c6a': '24348', // Gamestop staging
  'org-4a65238ed2811743': '3071', // Footlocker staging
  'org-0a704e68d9157af0': '3071', // Footlocker prod
};

module.exports = LinkShare;
