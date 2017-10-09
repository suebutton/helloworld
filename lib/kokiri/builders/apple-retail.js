const { get, pick } = require('lodash');

const { parseUrl, formatUrl, joinPathname, cleanPathname } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

/**
 * Apple Retail
 *
 * Supports the following destination object:
 *
 * {
 *   pathname
 * }
 *
 */
class AppleRetail extends LinkBuilder {
  publisherToken() {
    return get(AppleRetail.publisherTokenMap, this.publisherId, '1101lMpQ');
  }

  pathname(pathname, attributionToken) {
    const publisherToken = this.publisherToken();

    return joinPathname([
      'click',
      `camref:${publisherToken}`,
      `pubref:${attributionToken}`,
      'destination:http://www.apple.com',
      pathname,
    ]);
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname } = appDestination;

    return formatUrl(
      {
        protocol: 'http',
        hostname: 'aos.prf.hn',
        pathname: this.pathname(pathname, attributionToken),
      },
      false
    );
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname } = destination;
    const cleanedPathname = cleanPathname(pathname);

    return formatUrl(
      {
        protocol: 'http',
        hostname: 'aos.prf.hn',
        pathname: this.pathname(cleanedPathname, attributionToken),
      },
      false
    );
  }

  getPartnerSubdomain() {
    return null;
  }

  getDestinationFromUrl(url) {
    return pick(parseUrl(url), ['pathname']);
  }
}

AppleRetail.AppMappings = [
  {
    match: matchPathname(
      /^\/?shop\/accessories\/all-accessories\/beats(?:\/.*|$)/
    ),
    destination: {
      pathname: 'xc/beats//',
    },
  },
  {
    match: matchPathname(/^\/?ipad(?:\/.*|$)/),
    destination: {
      pathname: 'xc/ipad//',
    },
  },
  {
    match: matchPathname(/^\/?mac(?:\/.*|$)/),
    destination: {
      pathname: 'xc/mac//',
    },
  },
  {
    match: matchPathname(/^\/?iphone(?:\/.*|$)/),
    destination: {
      pathname: 'xc/iphone//',
    },
  },
  {
    match: matchPathname(/^\/?watch(?:\/.*|$)/),
    destination: {
      pathname: 'xc/watch//',
    },
  },
  {
    match: matchHomepage,
  },
];

AppleRetail.publisherTokenMap = {
  'org-2d432a88b9bb8bda': '1101ly5X', // Ibotta
  'org-030575eddb72b4df': '1101lMpQ', // Shopkick
};

module.exports = AppleRetail;
