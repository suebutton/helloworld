const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const ImpactRadius = require('./impact-radius');
const { matchHomepage } = require('../app-mapping');

/**
 * siteid is used to determine what publisher the request came from
 */
const SITEID_NAME = 'siteid';
const SITEID_FALLBACK = '5112233';

class Hotwire extends LinkBuilder {
  constructor(...args) {
    super(...args);
    this.impactRadiusBuilder = new ImpactRadius(...args);
  }

  siteid() {
    return this.getPartnerValue(SITEID_NAME, SITEID_FALLBACK);
  }

  appQuery(appDestination) {
    return {
      ...appDestination.query,
      nwid: 'Bt',
      siteID: this.siteid(),
    };
  }

  getBrowserLink(...args) {
    return this.impactRadiusBuilder.getBrowserLink(...args);
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'hotwireapp',
      hostname: null,
      pathname,
      query: this.appQuery(appDestination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, hash } = appDestination;
    const query = this.appQuery(appDestination);

    return formatButtonUniversalUrl('hotwire', {
      pathname,
      query,
      hash,
    });
  }
}

Hotwire.AppMappings = [{ match: matchHomepage }];

Hotwire.HasButtonWebAffiliation = false;

module.exports = Hotwire;
