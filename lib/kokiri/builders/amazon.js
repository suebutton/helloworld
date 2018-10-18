const { formatUrl } = require('../lib');

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

const PUBLISHER_TAG_NAME = 'tag';
const PUBLISHER_TAG_FALLBACK = 'button';

class Amazon extends LinkBuilder {
  publisherTag() {
    return this.getPartnerValue(PUBLISHER_TAG_NAME, PUBLISHER_TAG_FALLBACK);
  }

  query(destination, attributionToken) {
    const { query } = destination;

    const tag = this.publisherTag();
    const ascsubtag = attributionToken;

    return { ...query, ...{ tag, ascsubtag } };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

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
}

Amazon.AppMappings = [
  {
    match: destination => Amazon.webviewOnlyPaths.has(destination.pathname),
    destination: null,
  },
  {
    match: true,
  },
];

Amazon.webviewOnlyPaths = new Set([
  '/afx/nc/primefreshbenefits',
  '/Audible-Free-Trial-Digital-Membership/dp/B00NB86OYE',
  '/Audible-Gold-Digital-Membership/dp/B00NB873RG',
  '/b/ref=pntry_SFPD_EAN',
  '/dp/B00NB873RG',
  '/dp/B00OQVZDJM',
  '/dp/B00DBYBNEE',
  '/dp/B079TDZWV8',
  '/dp/B07D855XRN',
  '/gp/baby/homepage',
  '/gp/dmusic/promotions/AmazonMusicUnlimited',
  '/gp/kindle/ku/gift_landing',
  '/gp/prime/pipeline/partner_landing',
  '/gp/video/primesignup',
  '/gp/video/offers',
  '/gp/wedding/homepage',
  '/kindle-dbs/hz/signup',
  '/kindleunlimited',
  '/primeday',
  '/probeautysns',
  '/rent-or-buy-amazon-video/b/ref=nav_shopall_aiv_shop',
  '/s/ref=lp_228899_ex_n_1',
  '/tryprimefree',
  '/unlimited60',
]);

module.exports = Amazon;
