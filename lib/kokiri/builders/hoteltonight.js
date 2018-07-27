const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');
const { OS_IOS } = require('../../constants');

/**
 * HotelTonight
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
const UTM_CAMPAIGN_NAME = 'utm-campaign';
const UTM_CAMPAIGN_FALLBACK = 'Button';

class HotelTonight extends LinkBuilder {
  utmCampaign() {
    return this.getPartnerValue(UTM_CAMPAIGN_NAME, UTM_CAMPAIGN_FALLBACK);
  }

  query() {
    return {
      adjust_tracker: 'z5iwhj',
      utm_source: 'Button',
      utm_campaign: this.utmCampaign(),
    };
  }

  getAppLink(appDestination, platform) {
    const hostname = platform === OS_IOS ? null : 'open';

    return formatUrl({
      protocol: 'hoteltonight',
      hostname,
      query: this.query(),
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.hoteltonight.com',
      pathname,
      query: { ...query, ...this.query() },
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatButtonUniversalUrl('hoteltonight', {
      pathname,
      query: { ...query, ...this.query() },
      hash,
    });
  }
}

HotelTonight.AppMappings = [{ match: matchHomepage }];

module.exports = HotelTonight;
