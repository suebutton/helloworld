const { extend } = require('lodash');

const { OS_ANDROID, FALLBACK_WEB, FALLBACK_PARAM } = require('../../constants');
const {
  formatUrl,
  formatButtonUniversalUrl,
  cleanPathname,
} = require('../lib');
const {
  composeMatches,
  matchPathname,
  matchHomepage,
  matchIOS,
  matchAndroid,
} = require('../app-mapping');

const LinkBuilder = require('./link-builder');

/**
 * Etsy
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
const UTM_CAMPAIGN_FALLBACK = 'us_location_buyer';
const UTM_CONTENT_NAME = 'utmcontent';
const UTM_CONTENT_FALLBACK = 'ibotta';

class Etsy extends LinkBuilder {
  utmcampaign() {
    return this.getPartnerValue(UTM_CAMPAIGN_NAME, UTM_CAMPAIGN_FALLBACK);
  }

  utmcontent() {
    return this.getPartnerValue(UTM_CONTENT_NAME, UTM_CONTENT_FALLBACK);
  }

  query(destination) {
    return extend({}, destination.query, {
      utm_medium: 'affiliate',
      utm_source: 'button',
      utm_campaign: this.utmcampaign(),
      utm_content: this.utmcontent(),
    });
  }

  getAppLink(appDestination) {
    const { pathname } = appDestination;

    return formatUrl({
      protocol: 'etsy',
      hostname: cleanPathname(pathname),
      pathname: null,
      query: this.query(appDestination),
      hash: null,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.etsy.com',
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination, platform) {
    const { pathname, hash } = appDestination;
    const query = this.query(appDestination);

    const queryWithFallback =
      platform === OS_ANDROID
        ? extend({}, query, { [FALLBACK_PARAM]: FALLBACK_WEB })
        : query;

    return formatButtonUniversalUrl('etsy', {
      pathname,
      query: queryWithFallback,
      hash,
    });
  }
}

Etsy.AppMappings = [
  {
    match: matchPathname('/featured/:slug'),
  },
  {
    match: matchPathname('/listing/:id/:slug?'),
  },
  {
    match: composeMatches(matchPathname('/c/(.*)?'), matchIOS),
  },
  {
    match: composeMatches(matchAndroid, matchHomepage),
    destination: {
      pathname: '/home',
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Etsy;
