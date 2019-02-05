const { isString } = require('lodash');

const LinkBuilder = require('./link-builder');
const {
  formatUrl,
  formatButtonUniversalUrl,
  normalizeHostname,
} = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');

const RFFRID_PREFIX_NUMBER_NAME = 'rffrid-number';
const RFFRID_PREFIX_NUMBER_FALLBACK = '00699.019';

const HOSTNAME_TO_REGION_MAP = {
  'hoteis.com': 'BR',
  'pt.hoteis.com': 'PT',
  'hoteles.com': 'LM',
  'co.hoteles.com': 'CO',
  'es.hoteles.com': 'ES',
  'hotels.com': 'US',
  'at.hotels.com': 'AT',
  'au.hotels.com': 'AU',
  'ca.hotels.com': 'CA',
  'ch.hotels.com': 'CH',
  'de.hotels.com': 'DE',
  'es.hotels.com': 'ES',
  'fi.hotels.com': 'FI',
  'fr.hotels.com': 'FR',
  'he.hotels.com': 'IL',
  'ie.hotels.com': 'IE',
  'it.hotels.com': 'IT',
  'nl.hotels.com': 'NL',
  'no.hotels.com': 'NO',
  'nz.hotels.com': 'NZ',
  'pl.hotels.com': 'PL',
  'se.hotels.com': 'SV',
  'sg.hotels.com': 'SG',
  'sv.hotels.com': 'SV',
  'uk.hotels.com': 'UK',
  'vi.hotels.com': 'VI',
};

const RFFRID_PASSTHROUGH_WHITELIST = new Set([
  'org-70d3021cf848725a', // Awin Prod
  'org-11f5e62b4ebe0005', // Awin Staging
]);

class HotelsDotCom extends LinkBuilder {
  hostname(destination) {
    if (normalizeHostname(destination.hostname) in HOSTNAME_TO_REGION_MAP) {
      return destination.hostname;
    }
    return 'www.hotels.com';
  }

  region(destination) {
    const hostname = this.hostname(destination);
    return HOSTNAME_TO_REGION_MAP[normalizeHostname(hostname)] || 'US';
  }

  /*  Hotels.com uses the RFFRID parameter as such, separating values by '.':
   *  * two-letter geo lets Hotels.com split up transactions by geo
   *  * 049 is Hotels.com value for Button
   *  * prefixNumber is Hotels.com value for a Publisher
   *  * Button passes our btn_ref after the Publisher value
   */
  publisherToken(destination, attributionToken) {
    const prefixNumber = this.getPartnerValue(
      RFFRID_PREFIX_NUMBER_NAME,
      RFFRID_PREFIX_NUMBER_FALLBACK
    );

    return [
      'aff.hcom',
      this.region(destination),
      '049.000',
      prefixNumber,
      attributionToken,
    ].join('.');
  }

  query(destination, attributionToken) {
    const { query } = destination;
    const rffrid = this.publisherToken(destination, attributionToken);

    return { ...query, rffrid };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'hotelsapp',
      hostname: 'www.hotels.com',
      pathname,
      query: this.query(appDestination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: this.hostname(destination),
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;
    let query = this.query(appDestination, attributionToken);

    // PB-92 To enable an odd variety of Reach testing with Hotels.com, we're
    // allowing Awin's rffrid value to be passed through to outbound web to app
    // links, with a minor tweak to the value (inserting `.btn`).
    //
    const { rffrid } = appDestination.query;
    if (
      RFFRID_PASSTHROUGH_WHITELIST.has(this.publisherId) &&
      isString(rffrid)
    ) {
      query = { ...query, rffrid: rffrid.replace('.kwrd=', '.btn.kwrd=') };
    }

    return formatButtonUniversalUrl('hotels', {
      pathname,
      query,
      hash,
    });
  }
}

HotelsDotCom.AppMappings = [
  {
    match: matchPathname('/ho:hotelid(\\d+)/(.*)?'),
    destination: {
      pathname: '/PPCHotelDetails',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ hotelid: match.hotelid },
      }),
    },
  },
  {
    match: matchPathname('/de:destinationid(\\d+)/(.*)?'),
    destination: {
      pathname: '/PPCSearch',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ destinationid: match.destinationid },
      }),
    },
  },
  {
    match: matchPathname('/hotel/details.html/(.*)?'),
  },
  {
    match: matchPathname('/search.do/(.*)?'),
  },
  {
    match: matchPathname('/hotel-deals/(.*)?'),
  },
  {
    match: matchHomepage,
  },
];

module.exports = HotelsDotCom;
