const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

const UTM_CAMPAIGN_NAME = 'utmcampaign';
const UTM_CAMPAIGN_FALLBACK = 'Button|Default|AllCustomers';
const UTM_SOURCE_NAME = 'utmsource';
const UTM_SOURCE_FALLBACK = 'Button|Default';

class DoorDash extends LinkBuilder {
  utmcampaign() {
    return this.getPartnerValue(UTM_CAMPAIGN_NAME, UTM_CAMPAIGN_FALLBACK);
  }

  utmsource() {
    return this.getPartnerValue(UTM_SOURCE_NAME, UTM_SOURCE_FALLBACK);
  }

  query(destination) {
    return {
      ...destination.query,
      ...{
        ignore_splash_experience: 'true',
        utm_medium: 'Affiliate',
        utm_campaign: this.utmcampaign(),
        utm_source: this.utmsource(),
      },
    };
  }

  getAppLink() {
    return formatUrl({
      protocol: 'doordash',
      hostname: 'doordash.com',
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.doordash.com',
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('doordash', appDestination);
  }
}

DoorDash.AppMappings = [{ match: matchHomepage }];

module.exports = DoorDash;
