const {
  formatUrl,
  formatButtonUniversalUrl,
  cleanPathname,
  joinPathname,
} = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchIOS } = require('../app-mapping');

const UTM_CAMPAIGN_NAME = 'utm_campaign';
const UTM_CAMPAIGN_FALLBACK = 'Button';

const UTM_CONTENT_NAME = 'utm_content';
const UTM_CONTENT_FALLBACK = 'CPA';

class WarbyParker extends LinkBuilder {
  utmCampaign() {
    return this.getPartnerValue(UTM_CAMPAIGN_NAME, UTM_CAMPAIGN_FALLBACK);
  }

  utmContent() {
    return this.getPartnerValue(UTM_CONTENT_NAME, UTM_CONTENT_FALLBACK);
  }

  query(destination) {
    return {
      ...destination.query,
      ...{
        utm_medium: 'affiliate',
        utm_source: 'Button',
        utm_campaign: this.utmCampaign(),
        utm_content: this.utmContent(),
      },
    };
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'wp',
      hostname: 'app',
      pathname: cleanPathname(pathname),
      query: this.query(appDestination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.warbyparker.com',
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname } = appDestination;
    return formatButtonUniversalUrl('warbyparker', {
      ...appDestination,
      ...{
        pathname: joinPathname(['app', pathname]),
        query: this.query(appDestination),
      },
    });
  }
}

WarbyParker.AppMappings = [{ match: matchIOS }];

WarbyParker.UniversalMappings = WarbyParker.AppMappings;

module.exports = WarbyParker;
