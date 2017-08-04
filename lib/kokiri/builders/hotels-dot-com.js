const { get, extend } = require('lodash');

const { formatUrl, attributeQuery } = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');
const LinkBuilder = require('./link-builder');

/**
 * HotelsDotCom
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
class HotelsDotCom extends LinkBuilder {
  publisherToken(attributionToken) {
    const prefix = get(
      HotelsDotCom.publisherTokenMap,
      this.publisherId,
      'aff.hcom.GL.049.000.00699.019'
    );

    return `${prefix}.${attributionToken}`;
  }

  query(destination, attributionToken) {
    const { query } = destination;
    const rffrid = this.publisherToken(attributionToken);

    return extend({}, query, { rffrid });
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
      hostname: 'www.hotels.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'hotels';
  }

  getUniversalLinkDestination(destination, platform, attributionToken) {
    const { pathname, hash } = destination;
    const query = this.query(destination, attributionToken);
    const rffrid = this.publisherToken(attributionToken);

    return {
      pathname,
      query: attributeQuery(query, rffrid, 'rffrid'),
      hash,
    };
  }
}

HotelsDotCom.AppMappings = [
  {
    match: matchPathname(/^\/?ho(\d+)(?:$|\/.*)/, ['hotelid']),
    destination: {
      pathname: '/PPCHotelDetails',
      query: (match, prevQuery) => extend({}, prevQuery, match),
    },
  },
  {
    match: matchPathname(/^\/?de(\d+)(?:$|\/.*)/, ['destinationid']),
    destination: {
      pathname: '/PPCSearch',
      query: (match, prevQuery) => extend({}, prevQuery, match),
    },
  },
  {
    match: matchPathname(/^\/?hotel\/details\.html(?:$|\/.*)/),
  },
  {
    match: matchPathname(/^\/?search\.do(?:$|\/.*)/),
  },
  {
    match: matchPathname(/^\/?hotel-deals(?:$|\/.*)/),
  },
  {
    match: matchHomepage,
  },
];

HotelsDotCom.publisherTokenMap = {
  'org-2d432a88b9bb8bda': 'aff.hcom.US.049.000.00695.019', // Ibotta
  'org-294d8a7f8adbd98f': 'aff.hcom.UK.049.000.300755.019', // Quidco
  'org-58bcf3e828b5fce0': 'aff.hcom.US.049.000.00696.019', // Conde Nast
  'org-19d6532e2376eb4b': 'aff.hcom.US.049.000.00698.019', // Tech Max App
  'org-0f678fa90f665ffa': 'aff.hcom.US.049.000.00700.019', // PureWow
  'org-50f4c427b35dc8e0': 'aff.hcom.US.049.000.00702.019', // Travel & Leisure
  'org-5d1bdff55e59248f': 'aff.hcom.US.049.000.00703.019', // Huff Po
  'org-32254abd094ddf2b': 'aff.hcom.US.049.000.00704.019', // AOL
  'org-34edcb613a7cf9bd': 'aff.hcom.US.049.000.00705.019', // GoEuro
  'org-0ba867f13fa01466': 'aff.hcom.US.049.000.00706.019', // HitList
  'org-277bb23de146ccbc': 'aff.hcom.US.049.000.00707.019', // Science
  'org-05f0909f295cdd24': 'aff.hcom.au.049.000.00712.019', // ShopBack
  'org-23b2dd1dfe306fb4': 'aff.hcom.fr.049.000.00713.019', // Cuponation
  'org-4cd319f0bb7b8efe': 'aff.hcom.UK.049.000.00708.019', // Savoo
  'org-52f5a588a34bbf84': 'aff.hcom.US.049.000.7278242.019', // Groupon Coupons
};

module.exports = HotelsDotCom;
