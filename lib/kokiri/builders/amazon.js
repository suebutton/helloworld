const { formatUrl, attributeQuery } = require('../lib');

const { get, extend } = require('lodash');

const LinkBuilder = require('./link-builder');

/**
 * Amazon
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
class Amazon extends LinkBuilder {
  publisherTag() {
    return get(Amazon.publisherTagMap, this.publisherId, 'button');
  }

  query(destination, attributionToken) {
    const { query } = destination;

    const tag = this.publisherTag();
    const ascsubtag = attributionToken;

    return extend({}, query, { tag, ascsubtag });
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    if (Amazon.webviewOnlyPaths.has(pathname)) {
      return null;
    }

    return formatUrl({
      protocol: 'com.amazon.mobile.shopping.web',
      hostname: 'www.amazon.com',
      pathname,
      query: this.query(appDestination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.amazon.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getUniversalLinkDestination(destination, attributionToken) {
    const { pathname, hash } = destination;
    const query = this.query(destination, attributionToken);

    return {
      pathname,
      query: attributeQuery(query, attributionToken, 'ascsubtag'),
      hash,
    };
  }

  getPartnerSubdomain() {
    return 'amazon';
  }
}

Amazon.AppMappings = [{ match: true }];

Amazon.publisherTagMap = {
  'org-2d432a88b9bb8bda': 'ibotta09-20', // Ibotta
  'org-3eec44df0966f6f0': 'ibotta09-20', // Button Demo
};

Amazon.webviewOnlyPaths = new Set([
  '/gp/kindle/ku/gift_landing',
  '/rent-or-buy-amazon-video/b/ref=nav_shopall_aiv_shop',
  '/tryprimefree',
  '/Audible-Free-Trial-Digital-Membership/dp/B00NB86OYE',
  '/gp/dmusic/promotions/AmazonMusicUnlimited',
  '/gp/video/primesignup',
  '/Audible-Gold-Digital-Membership/dp/B00NB873RG',
  '/gp/video/offers',
  '/kindleunlimited',
  '/gp/baby/homepage',
  '/gp/wedding/homepage',
  '/Amazon-Home-Services/b?ie=UTF8&node=10192820011',
  '/dp/B00DBYBNEE',
]);

module.exports = Amazon;
