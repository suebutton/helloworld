const { merge } = require('lodash');

const { formatUrl, formatButtonUniversalUrl } = require('../lib');

const { matchPathname } = require('../app-mapping');

const LinkBuilder = require('./link-builder');

/**
 * Boxed
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
const UTM_CAMPAIGN_NAME = 'utmcampaign';
const UTM_CAMPAIGN_FALLBACK = 'button';

class Boxed extends LinkBuilder {
  utmcampaign() {
    return this.getPartnerValue(UTM_CAMPAIGN_NAME, UTM_CAMPAIGN_FALLBACK);
  }

  query(destination) {
    return merge({}, destination.query, {
      utm_source: 'button',
      utm_medium: 'affiliate',
      utm_campaign: this.utmcampaign(),
    });
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'boxedwholesale',
      hostname: pathname,
      pathname: null,
      query: this.query(appDestination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.boxed.com',
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatButtonUniversalUrl('boxed', {
      pathname,
      query: this.query(appDestination),
      hash,
    });
  }
}

Boxed.AppMappings = [
  {
    match: matchPathname('/product/:productId([0-9]+)/(.*)'),
    destination: {
      pathname: match => `variants_gid/${match.productId}`,
    },
  },
  {
    match: matchPathname('/products/category/:categoryId([0-9]+)/(.*)'),
    destination: {
      pathname: match => `categories_gid/${match.categoryId}`,
    },
  },
  {
    match: matchPathname('/products/highlight/:highlightId([0-9]+)/(.*)'),
    destination: {
      pathname: match => `highlights_gid/${match.highlightId}`,
    },
  },
  {
    match: true,
  },
];

Boxed.UniversalMappings = [
  {
    match: matchPathname('/products/highlight/:highlightId([0-9]+)/(.*)'),
    destination: {
      pathname: '/a/key_live_jcbQOz5vtceYbCgKcCDNqogjBEdqwmzl',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ feature: 'highlights', gid: match.highlightId },
      }),
    },
  },
  {
    match: matchPathname('/products/category/:categoryId([0-9]+)/(.*)'),
    destination: {
      pathname: '/a/key_live_jcbQOz5vtceYbCgKcCDNqogjBEdqwmzl',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ feature: 'categories', gid: match.categoryId },
      }),
    },
  },
  {
    match: true,
  },
];

module.exports = Boxed;
