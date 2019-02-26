const { omit } = require('lodash');
const LinkBuilder = require('./link-builder');
const { formatUrl, normalizeHostname } = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');

const AFFCID_NAME = 'affcid';
const AFFCID_FALLBACK = '300843';

const HOSTNAME_TO_REGION_MAP = {
  'expedia.com.au': 'AU',
  'expedia.de': 'DE',
  'expedia.es': 'ES',
  'expedia.fr': 'FR',
  'expedia.co.id': 'ID',
  'expedia.com.my': 'MY',
  'expedia.com.ph': 'PH',
  'expedia.com.sg': 'SG',
  'expedia.co.th': 'TH',
  'expedia.com.tw': 'TW',
  'expedia.co.uk': 'UK',
  'expedia.com': 'US',
};

class Expedia extends LinkBuilder {
  // The below function helps us avoid two consecutive /
  // while joining certain types of path names snippets
  joinPathname(arr) {
    return arr.filter(a => !!a).join('/').replace(/\/+/g, '/');
  }

  hostname(destination) {
    if (normalizeHostname(destination.hostname) in HOSTNAME_TO_REGION_MAP) {
      return normalizeHostname(destination.hostname);
    }
    return 'expedia.com';
  }

  region(destination) {
    const hostname = this.hostname(destination);
    return HOSTNAME_TO_REGION_MAP[hostname] || 'US';
  }

  affcid(destination) {
    return [
      this.region(destination),
      'NETWORK',
      'BUTTON',
      this.getPartnerValue(AFFCID_NAME, AFFCID_FALLBACK),
    ].join('.');
  }

  cleanQuery(destination) {
    return omit(destination.query, ['affcid', 'afflid']);
  }

  query(destination, attributionToken) {
    const AFFCID = this.affcid(destination);
    const AFFLID = attributionToken;

    return { ...this.cleanQuery(destination), ...{ AFFCID, AFFLID } };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl(
      {
        protocol: 'https',
        hostname: `www.${this.hostname(appDestination)}`,
        pathname: this.joinPathname(['/mobile/deeplink', pathname]),
        query: this.query(appDestination, attributionToken),
        hash,
        slashes: true,
      },
      false
    );
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: `www.${this.hostname(destination)}`,
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }
}

Expedia.AppMappings = [
  {
    match: matchPathname('/Flights'),
    destination: {
      pathname: 'Flights-search',
    },
  },
  {
    match: matchPathname('/Hotels'),
    destination: {
      pathname: 'Hotel-search',
    },
  },
  {
    match: matchPathname('/Cars'),
    destination: {
      pathname: 'carsearch',
    },
  },
  {
    match: matchPathname('/car-hire'),
    destination: {
      pathname: 'carsearch',
    },
  },
  {
    match: matchPathname('/Activities'),
    destination: {
      pathname: 'things-to-do',
    },
  },
  {
    match: matchPathname('/Hotel-Search'),
  },
  {
    match: matchPathname('/:hotel_name_slug.:hotel_id_slug.Hotel-Information'),
  },
  {
    match: matchHomepage,
  },
];

module.exports = Expedia;
