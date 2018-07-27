const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * Ebags
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

const SOURCE_ID_NAME = 'sourceid';
const SOURCE_ID_FALLBACK = 'BTNBN';
const UTM_CAMPAIGN_NAME = 'utmcampaign';
const UTM_CAMPAIGN_FALLBACK = 'button';

class Ebags extends LinkBuilder {
  sourceid() {
    return this.getPartnerValue(SOURCE_ID_NAME, SOURCE_ID_FALLBACK);
  }

  utmcampaign() {
    return this.getPartnerValue(UTM_CAMPAIGN_NAME, UTM_CAMPAIGN_FALLBACK);
  }

  query() {
    return {
      sourceid: this.sourceid(),
      btnpid: this.publisherId,
      utm_campaign: this.utmcampaign(),
      utm_source: 'button',
      utm_medium: 'affiliate',
    };
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.ebags.com',
      pathname,
      query: { ...query, ...this.query() },
      hash,
      slashes: true,
    });
  }
}

Ebags.AppMappings = [{ match: matchHomepage }];

module.exports = Ebags;
