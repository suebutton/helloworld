const { isString } = require('lodash');
const LinkBuilder = require('./link-builder');
const { formatUrl, cleanPathname, normalizeHostname } = require('../lib');
const {
  matchHomepage,
  matchPathname,
  composeMatches,
  matchQuery,
} = require('../app-mapping');

const LOCALE_NAME = 'locale';

// ASOS should be consolidating all hostnames into asos.com by the end of 2019.
// Until then, we need to support the other TLDs and sub-domains.
const LOCALE_PATHNAME_MAP = {
  'asos.de': 'de',
  'asos.fr': 'fr',
  'au.asos.com': 'au',
  'us.asos.com': 'us',
};

// ASOS provided the following as possible locales that will trail asos.com:
const ALLOWED_LOCALE = new Set([
  'au',
  'de',
  'es',
  'fr',
  'it',
  'nl',
  'ru',
  'se',
  'us',
]);

class Asos extends LinkBuilder {
  // The below function helps us avoid two consecutive /
  // while joining certain types of path names snippets
  joinPathname(arr) {
    return arr.filter(a => !!a).join('/').replace(/\/+/g, '/');
  }

  localePathname(destination) {
    const normalizedHostname = normalizeHostname(destination.hostname);

    // The below safeguards for links passed by publishers
    // like "asos.com/us/men/" so that we don't generate incorrect links
    // like "asos.com/us/us/men".
    if (
      isString(destination.pathname) &&
      ALLOWED_LOCALE.has(destination.pathname.split('/')[1])
    ) {
      return '';
    } else if (normalizedHostname in LOCALE_PATHNAME_MAP) {
      return LOCALE_PATHNAME_MAP[normalizedHostname];
    }
    return this.getPartnerValue(LOCALE_NAME, '');
  }

  query(destination) {
    return { ...destination.query, affid: '20578' };
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'asos',
      hostname: cleanPathname(pathname),
      pathname: null,
      query: this.query(appDestination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, hash } = destination;

    return formatUrl(
      {
        protocol: 'https',
        hostname: 'm.asos.com',
        pathname: this.joinPathname([
          this.localePathname(destination),
          pathname,
        ]),
        query: this.query(destination),
        hash,
        slashes: true,
      },
      false
    );
  }
}

Asos.AppMappings = [
  {
    match: matchHomepage,
    destination: {
      pathname: '/home',
    },
  },
  {
    match: matchPathname(`/(${[...ALLOWED_LOCALE].join('|')})`),
    destination: {
      pathname: '/home',
    },
  },
  {
    match: matchPathname(
      '/:locale?/:topcategory/:subCategory/prd/:productId([0-9]+)'
    ),
    destination: {
      pathname: '/product',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ iid: match.productId },
      }),
    },
  },
  {
    match: composeMatches(
      matchPathname(
        '/:locale?/:base_category_slug/:sub_category_slug?/:sub_category_slug2?/cat/'
      ),
      matchQuery({ cid: /[0-9]+/ })
    ),
    destination: {
      pathname: '/category',
    },
  },
];

module.exports = Asos;
