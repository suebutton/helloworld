const {
  formatUrl,
  formatButtonUniversalUrl,
  cleanPathname,
} = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchIOS } = require('../app-mapping');

/**
 * Spring
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
class Spring extends LinkBuilder {
  query(destination) {
    const { query } = destination;
    const queryArgs = {
      hide_education: true,
      autologin: true,
      ref: 'button',
    };

    return { ...query, ...queryArgs };
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'com.shopspring.spring',
      hostname: cleanPathname(pathname),
      pathname: '',
      query: this.query(appDestination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.shopspring.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('shopspring', appDestination);
  }
}

Spring.AppMappings = [{ match: matchIOS }];
Spring.UniversalMappings = Spring.AppMappings;

module.exports = Spring;
