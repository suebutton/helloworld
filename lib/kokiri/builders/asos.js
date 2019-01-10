const { isString, merge } = require('lodash');
const LinkBuilder = require('./link-builder');
const { formatUrl, cleanPathname } = require('../lib');
const {
  matchHomepage,
  matchPathname,
  composeMatches,
  matchQuery,
} = require('../app-mapping');

const LOCALE_NAME = 'locale';

class Asos extends LinkBuilder {
  // The below function helps us avoid two consecutive /
  // while joining certain types of path names snippets
  joinPathname(arr) {
    return arr.filter(a => !!a).join('/').replace(/\/+/g, '/');
  }

  locale(destination) {
    const { pathname } = destination;

    // The below safeguards for links passed by publishers
    // like "asos.com/us/men/" so that we don't generate incorrect links
    // like "asos.com/us/us/men".
    if (isString(pathname) && pathname.split('/')[1] === 'us') {
      return '';
    }

    return this.getPartnerValue(LOCALE_NAME, '');
  }

  query(destination) {
    return merge({}, destination.query, {
      affid: '20578',
    });
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
        pathname: this.joinPathname([this.locale(destination), pathname]),
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
    match: matchPathname('/au'),
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
