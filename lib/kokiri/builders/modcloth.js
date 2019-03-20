const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

class Modcloth extends LinkBuilder {
  query(destination) {
    return {
      ...destination.query,
      utm_source: 'Button',
      utm_medium: 'Affiliate',
      utm_campaign: this.publisherId,
    };
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'modcloth',
      hostname: 'modcloth.com',
      pathname,
      query: this.query(appDestination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.modcloth.com',
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname } = appDestination;

    return formatButtonUniversalUrl('modcloth', {
      pathname,
      query: this.query(appDestination),
    });
  }
}

Modcloth.AppMappings = [
  { match: matchPathname('/shop/:id') },
  { match: matchPathname('/shop/:id1/:id2/:id3(\\d+).html') },
  { match: matchHomepage },
];

module.exports = Modcloth;
