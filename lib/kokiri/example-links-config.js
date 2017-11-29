/**
 * Database of links for use in app linking support reports
*/
const EXAMPLE_LINKS = [
  {
    merchant_id: 'org-XXX',
    url: 'https://www.hotels.com',
    label: 'Hotels link',
    bucket: 'Homepage',
  },
  {
    merchant_id: 'org-XXX',
    url: 'https://ebay.com',
    label: 'Ebay link',
    bucket: 'Homepage',
  },
  {
    merchant_id: 'org-237c40fe8ff17a79',
    url:
      'https://www.amazon.com/Very-Own-Name-Personalized-Book/dp/B01M2XDHEV/ref=sr_1_1_sspa?s=baby-products&ie=UTF8&qid=1511384084&sr=1-1-spons&keywords=book&psc=1',
    label: 'Amazon Name Book',
    bucket: 'Product',
  },
];

module.exports = EXAMPLE_LINKS;
