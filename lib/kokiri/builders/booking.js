const LinkBuilder = require('./link-builder');
const { formatUrl } = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');

const AID_NAME = 'aid';
const AID_FALLBACK = '1364923';

class Booking extends LinkBuilder {
  aid() {
    return this.getPartnerValue(AID_NAME, AID_FALLBACK);
  }

  query(destination, attributionToken) {
    const { query } = destination;

    const aid = this.aid();
    const label = attributionToken;

    return { ...query, ...{ aid, label } };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.booking.com',
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
      hostname: 'www.booking.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }
}

Booking.AppMappings = [
  {
    match: matchPathname('/index.html'),
  },
  {
    match: matchHomepage,
    destination: { pathname: '/index.html' },
  },
];

module.exports = Booking;
