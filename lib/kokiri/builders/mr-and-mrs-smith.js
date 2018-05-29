const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage, composeMatches, matchIOS } = require('../app-mapping');

/**
 * MrAndMrsSmith
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
class MrAndMrsSmith extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol: 'mrandmrssmith',
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.mrandmrssmith.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('mrandmrssmith', appDestination);
  }
}

MrAndMrsSmith.AppMappings = [
  { match: composeMatches(matchHomepage, matchIOS) },
];

module.exports = MrAndMrsSmith;
