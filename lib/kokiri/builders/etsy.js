const { merge } = require('lodash');

const { OS_ANDROID, FALLBACK_WEB, FALLBACK_PARAM } = require('../../constants');
const { formatUrl, cleanPathname } = require('../lib');
const {
  composeMatches,
  matchPathname,
  matchHomepage,
  matchIOS,
  matchAndroid,
} = require('../app-mapping');

const LinkBuilder = require('./link-builder');

/**
 * Etsy
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
class Etsy extends LinkBuilder {
  query(destination) {
    return merge({}, destination.query, {
      utm_medium: 'affiliate',
      utm_campaign: 'us_location_buyer',
      utm_content: 'button',
    });
  }

  getAppLink(appDestination) {
    const { pathname } = appDestination;

    return formatUrl({
      protocol: 'etsy',
      hostname: cleanPathname(pathname),
      pathname: null,
      query: this.query(appDestination),
      hash: null,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.etsy.com',
      pathname,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }

  getPartnerSubdomain() {
    return 'etsy';
  }

  getUniversalLinkDestination(appDestination, platform) {
    let query = this.query(appDestination);

    if (platform === OS_ANDROID) {
      query = merge({}, query, { [FALLBACK_PARAM]: FALLBACK_WEB });
    }

    return merge({}, appDestination, { query });
  }
}

Etsy.AppMappings = [
  {
    match: matchPathname('/featured/:slug'),
  },
  {
    match: matchPathname('/listing/:id/:slug?'),
  },
  {
    match: composeMatches(matchPathname('/c/(.*)?'), matchIOS),
  },
  {
    match: composeMatches(matchAndroid, matchHomepage),
    destination: {
      pathname: '/home',
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Etsy;
