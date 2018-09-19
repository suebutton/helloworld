const { matchAndroid } = require('../app-mapping');
const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const ImpactRadius = require('./impact-radius');

/**
 * Ticketmaster
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
class Ticketmaster extends LinkBuilder {
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
      protocol: 'ticketmaster',
      hostname: null,
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('ticketmaster', appDestination);
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

Ticketmaster.AppMappings = [
  {
    match: matchAndroid,
    destination: { pathname: null, query: null, hash: null },
  },
  { match: true },
];

Ticketmaster.HasButtonWebAffiliation = false;

module.exports = Ticketmaster;
