const LinkBuilder = require('./link-builder');

const { OS_ANDROID } = require('../../constants');

const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const { matchHomepage } = require('../app-mapping');

class DeliveryDotCom extends LinkBuilder {
  getAppLink(appDestination, platform) {
    return formatUrl({
      protocol: 'deliverydotcom',
      hostname: platform === OS_ANDROID ? 'app' : null,
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

DeliveryDotCom.AppMappings = [{ match: matchHomepage }];

module.exports = DeliveryDotCom;
