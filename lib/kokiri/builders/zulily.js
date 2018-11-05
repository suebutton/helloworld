const { get } = require('lodash');
const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  matchIOS,
  matchAndroid,
  composeMatches,
  matchHomepage,
  matchPathname,
} = require('../app-mapping');

const ZULILY_BUTTON_IDENTIFIER = '33175671';

const TID_PUBLISHER_NAME = 'tidpublisher';
const TID_PUBLISHER_FALLBACK = 'button';

class Zulily extends LinkBuilder {
  tidPublisher() {
    return this.getPartnerValue(TID_PUBLISHER_NAME, TID_PUBLISHER_FALLBACK);
  }

  tid(attributionToken) {
    return [
      ZULILY_BUTTON_IDENTIFIER,
      attributionToken,
      this.publisherId,
      this.tidPublisher(),
      '',
    ].join('_');
  }

  query(destination, attributionToken) {
    return {
      ...destination.query,
      tid: this.tid(attributionToken),
    };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname } = appDestination;

    return formatUrl({
      protocol: 'zulily',
      hostname: 'action.show',
      pathname,
      query: this.query(appDestination, attributionToken),
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    const { pathname, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.zulily.com',
      pathname,
      query: this.query(destination, attributionToken),
      hash,
      slashes: true,
    });
  }
}

const matchProductPage = matchPathname(
  '/p/:slug([^/]+-)?:eventId([0-9]+)-:productId([0-9]+).html'
);

const matchCategoryPage = matchPathname(
  '/:categoryName(girls|boys|kids|shoes|baby-maternity|men|health-and-beauty|womens-plus-sizes|womens-accessories|women|toys-playtime)'
);

const webCategoryNameToAppCategoryName = {
  'baby-maternity': 'babyMaternity',
  'health-and-beauty': 'healthBeauty',
  'womens-plus-sizes': 'plusSize',
  'womens-accessories': 'womenAccessories',
  'toys-playtime': 'toys',
};

Zulily.AppMappings = [
  {
    match: composeMatches(matchAndroid, matchHomepage),
    destination: {
      pathname: '/view/newToday',
    },
  },
  {
    match: composeMatches(matchIOS, matchHomepage),
    destination: {
      pathname: '/newToday',
    },
  },
  {
    match: composeMatches(matchIOS, matchProductPage),
    destination: {
      pathname: '/product',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ productId: match.productId, eventId: match.eventId },
      }),
    },
  },
  {
    match: composeMatches(matchAndroid, matchProductPage),
    destination: {
      pathname: match => `/view/product/${match.productId}`,
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ eventId: match.eventId },
      }),
    },
  },
  {
    match: matchCategoryPage,
    destination: {
      pathname: match =>
        `/view/category/${get(
          webCategoryNameToAppCategoryName,
          match.categoryName,
          match.categoryName
        )}`,
    },
  },
];

module.exports = Zulily;
