const LinkBuilder = require('./link-builder');

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
  getPartnerSubdomain() {
    return 'delivery';
  }
}

module.exports = DeliveryDotCom;
