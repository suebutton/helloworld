const { matchAndroid } = require('../app-mapping');
const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const ImpactRadius = require('./impact-radius');

class Ticketmaster extends LinkBuilder {
  constructor(...args) {
    super(...args);
    this.impactRadiusBuilder = new ImpactRadius(...args);
  }

  getBrowserLink(...args) {
    return this.impactRadiusBuilder.getBrowserLink(...args);
  }

  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'ticketmaster',
      hostname: null,
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('ticketmaster', appDestination);
  }
}

Ticketmaster.AppMappings = [
  {
    match: matchAndroid,
    destination: { pathname: null, query: null, hash: null },
  },
  { match: true },
];

Ticketmaster.HasButtonWebAffiliation = false;

module.exports = Ticketmaster;
