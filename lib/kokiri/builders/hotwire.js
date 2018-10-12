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

/**
 * siteid is used to determine what publisher the request came from
 */
const SITEID_NAME = 'siteid';
const SITEID_FALLBACK = '5112233';

class Hotwire extends LinkBuilder {
  constructor(...args) {
    super(...args);
    this.impactRadiusBuilder = new ImpactRadius(...args);
  }

  siteid() {
    return this.getPartnerValue(SITEID_NAME, SITEID_FALLBACK);
  }

  appQuery(appDestination) {
    return {
      ...appDestination.query,
      nwid: 'Bt',
      siteid: this.siteid(),
    };
  }

  getBrowserLink(...args) {
    return this.impactRadiusBuilder.getBrowserLink(...args);
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'hotwireapp',
      hostname: null,
      pathname,
      query: this.appQuery(appDestination),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, hash } = appDestination;
    const query = this.appQuery(appDestination);

    return formatButtonUniversalUrl('hotwire', {
      pathname,
      query,
      hash,
    });
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
