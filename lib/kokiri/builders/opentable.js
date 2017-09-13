const { get, extend } = require('lodash');

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
class OpenTable extends LinkBuilder {
  OTPublisherId() {
    return get(OpenTable.publisherIdMap, this.publisherId, 'btn-prod-refid');
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

OpenTable.publisherIdMap = {
  'org-290b2877c15d987b': '169542', // foursquare
  'org-5c8e309e857f34a7': '310591', // aviate
  'org-2bc92c23f728c2f1': '311093', // moovit
  'org-5c4998fa32891127': '314456', // the infatuation
  'org-0f678fa90f665ffa': '338696', // purewow
  'org-58bcf3e828b5fce0': '338698', // conde nast traveller
};

OpenTable.AppMappings = [{ match: matchHomepage }];

module.exports = OpenTable;
