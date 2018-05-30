const { merge } = require('lodash');

const { formatUrl, formatButtonUniversalUrl } = require('../lib');

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
      hostname: 'boxed.com',
      pathname,
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
    match: destination => Boxed.webviewOnlyPaths.has(destination.pathname),
    destination: null,
  },
  { match: true },
];

Boxed.webviewOnlyPaths = new Set(['/products/highlight/67/prince-spring']);

module.exports = Boxed;
