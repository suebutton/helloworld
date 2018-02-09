const { get, omit, extend } = require('lodash');

const { parseUrl, formatUrl, normalizeHostname } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage, matchPathname } = require('../app-mapping');

/**
 * Ebay
 *
 * Supports the following destination object:
 *
 * {
 *   hostname,
 *   pathname,
 *   query,
 *   hash
 * }
 *
 */

const PUB_NAME = 'pub';
const PUB_FALLBACK = '5575211063';
const CAMP_ID_NAME = 'campid';
const CAMP_ID_FALLBACK = '5337936547';
const PROGRAM_IDS = {
  'ebay.at': '5221-53469',
  'ebay.be': '1553-53471',
  'ebay.ca': '706-53473',
  'ebay.ch': '5222-53480',
  'ebay.co.uk': '710-53481',
  'ebay.com': '711-53200',
  'ebay.com.au': '705-53470',
  'ebay.de': '707-53477',
  'ebay.es': '1185-53479',
  'ebay.fr': '709-53476',
  'ebay.ie': '5282-53468',
  'ebay.it': '724-53478',
  'ebay.nl': '1346-53482',
};

class Ebay extends LinkBuilder {
  pub() {
    return this.getPartnerValue(PUB_NAME, PUB_FALLBACK);
  }

  campid() {
    return this.getPartnerValue(CAMP_ID_NAME, CAMP_ID_FALLBACK);
  }

  programid(hostname) {
    return PROGRAM_IDS[normalizeHostname(hostname)] || null;
  }

  redirectHostname(destination) {
    const { hostname } = destination;
    return hostname || 'www.ebay.com';
  }

  redirectUrl(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'http',
      hostname: this.redirectHostname(destination),
      pathname,
      query: omit(query, ['ff3', 'toolid', 'pub', 'campid', 'customid']),
      hash,
      slashes: true,
    });
  }

  query(destination, attributionToken) {
    return {
      ff3: '4',
      toolid: '11800',
      pub: this.pub(),
      campid: this.campid(),
      customid: attributionToken,
      mpre: this.redirectUrl(destination),
    };
  }

  appQuery(appDestination, attributionToken, destination) {
    return extend({}, appDestination.query, {
      referrer: this.getBrowserLink(destination, attributionToken),
    });
  }

  getAppLink(appDestination, platform, attributionToken, destination) {
    const programid = this.programid(appDestination.hostname);
    if (programid === null) {
      return null;
    }
    const { hash } = appDestination;

    return formatUrl({
      protocol: 'ebay',
      hostname: 'link',
      pathname: null,
      query: this.appQuery(appDestination, attributionToken, destination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    const programid = this.programid(destination.hostname);
    if (programid === null) {
      return null;
    }
    return formatUrl({
      protocol: 'https',
      hostname: 'rover.ebay.com',
      pathname: `/rover/1/${programid}-19255-0/1`,
      query: this.query(destination, attributionToken),
      slashes: true,
    });
  }

  getDestinationFromUrl(url) {
    const { hostname, query } = parseUrl(url);

    if (hostname === 'rover.ebay.com') {
      const targetUrl = get(query, 'mpre', 'https://ebay.com');
      return this.getDestinationFromUrl(targetUrl);
    }

    return extend({}, super.getDestinationFromUrl(url), { hostname });
  }
}

Ebay.AppMappings = [
  {
    match: matchPathname('/ctg/:slug?/:productId(\\d+)'),
    destination: {
      query: match => ({ nav: 'item.product', epid: match.productId }),
    },
  },
  {
    match: matchPathname('/itm/:slug?/:itemId(\\d+)'),
    destination: {
      query: match => ({ nav: 'item.view', id: match.itemId }),
    },
  },
  {
    match: matchHomepage,
    destination: {
      query: { nav: 'home' },
    },
  },
];

module.exports = Ebay;
