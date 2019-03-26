const {
  formatUrl,
  formatButtonUniversalUrl,
  cleanPathname,
} = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  matchPathname,
  matchHomepage,
  composeMatches,
  matchIOS,
  matchAndroid,
} = require('../app-mapping');
const { extend } = require('lodash');

class Jet extends LinkBuilder {
  appQuery() {
    return {
      pid: 'button_int',
      c: 'JET_BUTTON',
      is_retargeting: 'true',
      af_siteid: this.publisherId,
    };
  }

  webQuery() {
    return {
      pid: 'button_int',
      c: 'JET_BUTTON',
      is_retargeting: 'true',
      af_siteid: this.publisherId,
      jcmp: `${'afl:btn:'}${this.publisherId}${':na:na:na'}`,
    };
  }

  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;
    return formatUrl({
      protocol: 'jet',
      hostname: cleanPathname(pathname),
      pathname: null,
      query: extend({}, query, this.appQuery()),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.jet.com',
      pathname,
      query: extend({}, query, this.webQuery()),
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl(
      'jet',
      extend({}, appDestination, {
        query: extend({}, appDestination.query, this.appQuery()),
      })
    );
  }
}

const matchProductPage = matchPathname(
  '/product/:slug?/:productId(\\w{32})/(.*)?'
);

const matchSearchPage = matchPathname('/search/(.*)?');

const matchUniquelyJPage = matchPathname('/shop/uniquelyj');

const matchBackToSchoolPage = matchPathname('/shop/backtoschool');

const matchCategoryPage = matchPathname('/c/:slug/:remainingPath(.*)?');

Jet.AppMappings = [
  {
    match: composeMatches(matchProductPage, matchIOS),
    destination: {
      pathname: match => `jet.com/product/product/${match.productId}`,
    },
  },
  {
    match: composeMatches(matchSearchPage, matchIOS),
    destination: {
      pathname: 'jet.com/search',
    },
  },
  {
    match: composeMatches(matchSearchPage, matchAndroid),
    destination: {
      pathname: 'search',
    },
  },
  {
    match: matchUniquelyJPage,
    destination: {
      pathname: `shop/uniquelyj`,
    },
  },
  {
    match: matchBackToSchoolPage,
    destination: {
      pathname: `shop/backtoschool`,
    },
  },
  {
    match: composeMatches(matchHomepage, matchIOS),
    destination: {
      pathname: 'home',
    },
  },
  {
    match: composeMatches(matchHomepage, matchAndroid),
    destination: {
      pathname: 'open',
    },
  },
  {
    match: composeMatches(matchCategoryPage, matchIOS),
  },
];

Jet.UniversalMappings = [
  {
    match: composeMatches(matchProductPage, matchIOS),
    destination: {
      pathname: match => `product/product/${match.productId}`,
    },
  },
  {
    match: composeMatches(matchHomepage, matchIOS),
    destination: {
      pathname: 'home',
    },
  },
  {
    match: matchIOS,
  },
  {
    match: composeMatches(matchHomepage, matchAndroid),
  },
];

module.exports = Jet;
