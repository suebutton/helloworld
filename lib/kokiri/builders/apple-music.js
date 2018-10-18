const { formatUrl } = require('../lib');

const LinkBuilder = require('./link-builder');

/**
 * Affiliation Token(at) determines the account a transaction reports to.
 * The account defines the types of offers available.
 */
const AFFILIATION_TOKEN_NAME = 'at';
const AFFILIATION_TOKEN_FALLBACK = '1000lura';

class AppleMusic extends LinkBuilder {
  at() {
    return this.getPartnerValue(
      AFFILIATION_TOKEN_NAME,
      AFFILIATION_TOKEN_FALLBACK
    );
  }

  query(destination, attributionToken) {
    const { query } = destination;

    const at = this.at();
    const mt = '1';
    const app = 'music';
    const ct = attributionToken;

    return { ...query, ...{ at, mt, app, ct } };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'musics',
      hostname: 'geo.itunes.apple.com',
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
      hostname: 'itunes.apple.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }
}

module.exports = AppleMusic;
