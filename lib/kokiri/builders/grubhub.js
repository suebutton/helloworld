const { formatUrl, formatButtonUniversalUrl, joinPathname } = require('../lib');
const LinkBuilder = require('./link-builder');
const {
  matchHomepage,
  composeMatches,
  matchAndroid,
  matchIOS,
  matchPathname,
  matchQuery,
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

// We only support a fixed list of cuisines that was supplied by Grubhub to us
// Since there is no graceful fallback in Grubhub's ap for any other cuisine types
const cuisineList = [
  'afghan',
  'african',
  'albanian',
  'alcohol',
  'american',
  'argentinian',
  'asian',
  'australian',
  'austrian',
  'bagels',
  'bakery',
  'bbq',
  'belgian',
  'brazilian',
  'british',
  'burmese',
  'cajun',
  'californian',
  'calzones',
  'cambodian',
  'cantonese',
  'caribbean',
  'cheesesteaks',
  'chicken',
  'chili',
  'chinese',
  'classic',
  'coffee and tea',
  'colombian',
  'costa rican',
  'crepes',
  'cuban',
  'deli',
  'dessert',
  'dim sum',
  'diner',
  'dominican',
  'eclectic',
  'ecuadorian',
  'egyptian',
  'el salvadoran',
  'empanadas',
  'english',
  'ethiopian',
  'filipino',
  'fine dining',
  'french',
  'fresh fruits',
  'frozen yogurt',
  'german',
  'gluten-free',
  'greek',
  'grill',
  'grocery items',
  'guatemalan',
  'gyro',
  'haitian',
  'halal',
  'hamburgers',
  'hawaiian',
  'healthy',
  'hoagies',
  'hot dogs',
  'ice cream',
  'indian',
  'indonesian',
  'irish',
  'italian',
  'jamaican',
  'japanese',
  'kids menu',
  'korean',
  'kosher',
  'kosher-style',
  'late night',
  'latin american',
  'lebanese',
  'low carb',
  'low fat',
  'lunch specials',
  'malaysian',
  'mandarin',
  'mediterranean',
  'mexican',
  'middle eastern',
  'mongolian',
  'moroccan',
  'nepalese',
  'new american',
  'noodles',
  'organic',
  'pakistani',
  'pasta',
  'persian',
  'peruvian',
  'pitas',
  'pizza',
  'polish',
  'portuguese',
  'potato',
  'pub food',
  'puerto rican',
  'ramen',
  'ribs',
  'russian',
  'salads',
  'sandwiches',
  'scandinavian',
  'seafood',
  'senegalese',
  'shakes',
  'smoothies and juices',
  'soul food',
  'soup',
  'south african',
  'south american',
  'southern',
  'southwestern',
  'spanish',
  'steak',
  'subs',
  'sushi',
  'szechwan',
  'taiwanese',
  'tapas',
  'tex-mex',
  'thai',
  'tibetan',
  'turkish',
  'ukrainian',
  'vegan',
  'vegetarian',
  'venezuelan',
  'vietnamese',
  'wings',
  'wraps',
];

const cuisineRegex = new RegExp(`^cuisine:(${cuisineList.join('|')})$`);

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
  {
    match: matchPathname('/restaurant/:slug?/:restaurantId([0-9]+)'),
    destination: {
      pathname: match => joinPathname(['restaurant', match.restaurantId]),
    },
  },
  {
    match: composeMatches(
      matchPathname('/search'),
      matchQuery({
        orderMethod: /^(delivery|pickup)$/,
        facet: cuisineRegex,
      })
    ),
    destination: {
      pathname: (match, p, d) =>
        joinPathname([
          d.query.orderMethod,
          'cuisine',
          d.query.facet.split(':')[1],
        ]),
      query: {},
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
