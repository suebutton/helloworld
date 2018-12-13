const { get, omit } = require('lodash');
const {
  parseUrl,
  formatUrl,
  normalizeHostname,
  normalizeUrl,
} = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage, matchPathname } = require('../app-mapping');

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

const CAMPID_PASSTHROUGH_WHITELIST = {
  'org-2d432a88b9bb8bda': new Set(['5338414862', '5338414863', '5337936547']), // Ibotta
};

class Ebay extends LinkBuilder {
  pub() {
    return this.getPartnerValue(PUB_NAME, PUB_FALLBACK);
  }

  campid(destination) {
    const { query } = destination;

    // Publishers need to be able to pass through eBay Campaign IDs
    // for eBay's experiementation purposes. This let's them pass
    // through values into the campid parameter. See PB-14 for details.
    if (
      get(CAMPID_PASSTHROUGH_WHITELIST, this.publisherId, new Set()).has(
        query.campid
      )
    ) {
      return query.campid;
    }

    return this.getPartnerValue(CAMP_ID_NAME, CAMP_ID_FALLBACK);
  }

  programId(destination) {
    const hostname = normalizeHostname(this.redirectHostname(destination));

    return PROGRAM_IDS[hostname] || PROGRAM_IDS['ebay.com'];
  }

  redirectHostname(destination) {
    const hostname = destination.hostname.replace(/^m\./, 'www.');

    return normalizeHostname(hostname) in PROGRAM_IDS
      ? hostname
      : 'www.ebay.com';
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
      campid: this.campid(destination),
      customid: attributionToken,
      mpre: this.redirectUrl(destination),
    };
  }

  appQuery(appDestination, attributionToken, destination) {
    return {
      ...appDestination.query,
      referrer: this.getBrowserLink(destination, attributionToken),
    };
  }

  getAppLink(appDestination, platform, attributionToken, destination) {
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
    return formatUrl({
      protocol: 'https',
      hostname: 'rover.ebay.com',
      pathname: `/rover/1/${this.programId(destination)}-19255-0/1`,
      query: this.query(destination, attributionToken),
      slashes: true,
    });
  }

  getDestinationFromUrl(url) {
    const { hostname, query } = parseUrl(url);

    if (hostname === 'rover.ebay.com') {
      const targetUrl = normalizeUrl(get(query, 'mpre', 'https://ebay.com'));
      return super.getDestinationFromUrl(targetUrl);
    }

    return super.getDestinationFromUrl(url);
  }
}

Ebay.AppMappings = [
  {
    match: matchPathname('/b/:slug/:categoryId(\\d+)/(.*)'),
    destination: {
      query: match => ({ nav: 'item.browse', categoryId: match.categoryId }),
    },
  },
  {
    match: matchPathname('/rpp/:slug/:event_slug'),
    destination: {
      query: match => ({ nav: 'item.events', eventname: match.event_slug }),
    },
  },
  {
    match: matchPathname('/b/:slug/bn_:pathId(\\d+)'),
    destination: {
      query: match => ({
        nav: 'item.query',
        keywords: match.slug.replace(/-/g, '+'),
      }),
    },
  },
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
  {
    match: true,
    destination: {
      pathname: null,
      query: { nav: 'home' },
    },
  },
];

module.exports = Ebay;
