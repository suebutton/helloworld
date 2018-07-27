const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

/**
 * Cheapoair
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
class Cheapoair extends LinkBuilder {
  query(destination) {
    const { query } = destination;
    return {
      ...query,
      ...{ FpAffiliate: 'Button' },
    };
  }

  appQuery(destination) {
    const query = this.query(destination);

    const t = 'f';
    const tt = '1';

    return { ...query, ...{ t, tt } };
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'fpinapp',
      hostname: 'cheapoair',
      pathname,
      query: this.appQuery(appDestination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'm.cheapoair.com',
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatButtonUniversalUrl('cheapoair', {
      pathname,
      query: this.query(appDestination),
      hash,
    });
  }
}

Cheapoair.AppMappings = [
  {
    match: matchPathname('/flights/(.*)?'),
    destination: {
      pathname: 'remotesearchhandler',
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Cheapoair;
