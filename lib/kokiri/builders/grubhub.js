const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  matchHomepage,
  composeMatches,
  matchAndroid,
  matchIOS,
} = require('../app-mapping');

const PUBLISHER_ID_NAME = 'publisherid';
const PUBLISHER_ID_FALLBACK = '1166';

class Grubhub extends LinkBuilder {
  pubId() {
    return this.getPartnerValue(PUBLISHER_ID_NAME, PUBLISHER_ID_FALLBACK);
  }

  query(destination, attributionToken) {
    const pubId = this.pubId();
    return {
      ...destination.query,
      utm_medium: 'affiliate',
      utm_source: 'button-affiliate-network',
      utm_campaign: pubId,
      affiliate: pubId,
      affiliate_data: attributionToken,
    };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname } = appDestination;

    return formatUrl(
      {
        protocol: 'grubhubapp',
        hostname: pathname,
        pathname: null,
        query: this.query(appDestination, attributionToken),
        slashes: true,
      },
      false
    );
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, hash } = destination;

    return formatUrl(
      {
        protocol: 'https',
        hostname: 'grubhub.com',
        pathname,
        query: this.query(destination, attributionToken),
        hash,
        slashes: true,
      },
      false
    );
  }

  getButtonUniversalLink(appDestination, platform, attributionToken) {
    const { pathname } = appDestination;

    return formatButtonUniversalUrl('grubhub', {
      pathname,
      query: this.query(appDestination, attributionToken),
    });
  }
}

Grubhub.AppMappings = [
  {
    match: composeMatches(matchHomepage, matchIOS),
    destination: {
      pathname: 'account/favorites',
    },
  },
  {
    match: composeMatches(matchHomepage, matchAndroid),
    destination: {
      pathname: 'account/favorites/',
    },
  },
];

Grubhub.UniversalMappings = [
  {
    match: matchHomepage,
    destination: {
      pathname: '/search',
    },
  },
];

module.exports = Grubhub;
