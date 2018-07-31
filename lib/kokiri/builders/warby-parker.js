const {
  formatUrl,
  formatButtonUniversalUrl,
  cleanPathname,
  joinPathname,
} = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchIOS } = require('../app-mapping');

/**
 * Warby Parker
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
class WarbyParker extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'wp',
      hostname: 'app',
      pathname: cleanPathname(pathname),
      query,
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.warbyparker.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname } = appDestination;
    return formatButtonUniversalUrl('warbyparker', {
      ...appDestination,
      ...{ pathname: joinPathname(['app', pathname]) },
    });
  }
}

WarbyParker.AppMappings = [{ match: matchIOS }];

WarbyParker.UniversalMappings = WarbyParker.AppMappings;

module.exports = WarbyParker;
