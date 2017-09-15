const { get, merge } = require('lodash');

const { formatUrl } = require('../lib');
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
class HotelTonight extends LinkBuilder {
  utmCampaign() {
    return get(HotelTonight.utmCampaignMap, this.publisherId, 'Button');
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
      query: merge({}, query, this.query()),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'hoteltonight';
  }

  getUniversalLinkDestination(destination) {
    return merge({}, destination, { query: this.query() });
  }
}

HotelTonight.AppMappings = [{ match: matchHomepage }];

HotelTonight.utmCampaignMap = {
  'org-2d432a88b9bb8bda': 'Button_Ibotta', // Ibotta
};

module.exports = HotelTonight;
