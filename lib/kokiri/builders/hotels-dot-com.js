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
  'hotels.com': 'US',
  'au.hotels.com': 'AU',
  'ca.hotels.com': 'CA',
  'ch.hotels.com': 'CH',
  'de.hotels.com': 'DE',
  'es.hotels.com': 'ES',
  'fi.hotels.com': 'FI',
  'fr.hotels.com': 'FR',
  'ie.hotels.com': 'IE',
  'it.hotels.com': 'IT',
  'sg.hotels.com': 'SG',
  'sv.hotels.com': 'SV',
  'uk.hotels.com': 'UK',
};

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

    return { ...query, ...{ rffrid } };
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

    return formatButtonUniversalUrl('hotels', {
      pathname,
      query: this.query(appDestination, attributionToken),
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
