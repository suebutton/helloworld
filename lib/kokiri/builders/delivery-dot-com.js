const LinkBuilder = require('./link-builder');
const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const { matchHomepage, composeMatches, matchIOS } = require('../app-mapping');

class DeliveryDotCom extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol: 'deliverydotcom',
      hostname: null,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.delivery.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('delivery', appDestination);
  }
}

DeliveryDotCom.AppMappings = [
  {
    match: composeMatches(matchHomepage, matchIOS),
  },
];

DeliveryDotCom.UniversalMappings = DeliveryDotCom.AppMappings;

module.exports = DeliveryDotCom;
