const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const ImpactRadius = require('./impact-radius');
const { matchHomepage } = require('../app-mapping');

/**
 * Hotwire
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
class Hotwire extends LinkBuilder {
  constructor(...args) {
    super(...args);
    this.impactRadiusBuilder = new ImpactRadius(...args);
  }
  getBrowserLink(...args) {
    return this.impactRadiusBuilder.getBrowserLink(...args);
  }

  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'hotwireapp',
      hostname: null,
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('hotwire', appDestination);
  }

  // TODO(will) destination extraction becomes a bit clumsy with these
  // composite builders.  Rethink this use-case as long as the idea of
  // destination in general.
  //
  // For now, simply make sure the destination extracted here returns all keys
  // needed by either builder.
  //
  getDestinationFromUrl(url) {
    return {
      ...super.getDestinationFromUrl(url),
      ...this.impactRadiusBuilder.getDestinationFromUrl(url),
    };
  }
}

Hotwire.AppMappings = [{ match: matchHomepage }];

Hotwire.HasButtonWebAffiliation = false;

module.exports = Hotwire;
