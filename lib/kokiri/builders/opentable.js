const { extend } = require('lodash');

const { OS_IOS } = require('../../constants');
const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

/**
 * OpenTable
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

const OT_PUBLISHER_ID_NAME = 'publisher-id';
const OT_PUBLISHER_ID_FALLBACK = 'btn-prod-refid';

class OpenTable extends LinkBuilder {
  OTPublisherId() {
    return this.getPartnerValue(OT_PUBLISHER_ID_NAME, OT_PUBLISHER_ID_FALLBACK);
  }

  query() {
    return {
      reengagement: 1,
      partner_id: 2183,
      invoke_id: 133730,
      publisher_id: this.OTPublisherId(),
    };
  }

  getAppLink(appDestination, platform) {
    const [protocol, hostname] =
      platform === OS_IOS
        ? ['opentable', null]
        : ['vnd.opentable.deeplink', 'opentable.com'];

    return formatUrl({
      protocol,
      hostname,
      pathname: null,
      query: this.query(),
      hash: null,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.opentable.com',
      pathname,
      query: extend({}, query, this.query()),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return null;
  }
}

OpenTable.AppMappings = [{ match: matchHomepage }];

module.exports = OpenTable;
