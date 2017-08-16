const LinkBuilder = require('./link-builder');

const { OS_ANDROID } = require('../../constants');

const { formatUrl } = require('../lib');
const { matchHomepage } = require('../app-mapping');

/**
 * Delivery.com
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
class DeliveryDotCom extends LinkBuilder {
  getAppLink(appDestination, platform) {
    return formatUrl({
      protocol: 'deliverydotcom',
      hostname: platform === OS_ANDROID ? 'app' : null,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'delivery';
  }
}

DeliveryDotCom.AppMappings = [{ match: matchHomepage }];

module.exports = DeliveryDotCom;
