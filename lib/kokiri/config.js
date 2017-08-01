/**
 * Returns the org id for the current environment
 *
 * @param  {string} staging
 * @param  {string} production
 * @return {string}
 */
function idForEnv(staging, production) {
  return process.env.NODE_ENV === 'production' ? production : staging;
}

const ORGANIZATION_IDS = {
  hotelsdotcom: idForEnv('org-3573c6b896624279', 'org-3a4aad7eb3f326d0'),
  groupon: idForEnv('org-681847bf6cc4d57c', 'org-46cb47cf8637e3d6'),
  ebay: idForEnv('org-5d63b849c1d24db2', 'org-6bef1aa726081cf9'),
  walmart: idForEnv('org-2365a4c935cb296b', 'org-6fe28fdfd1b0cdc2'),
  jet: idForEnv('org-7edde2ff2a553edd', 'org-01e12b03f6a07d54'),
  boxed: idForEnv('org-372a59a7b6ddb53b', 'org-1fe24b86920e754b'),
  spring: idForEnv('org-5f8137923a8ee6e3', 'org-1205d831b97b8898'),
  amazon: idForEnv('org-3b6a623e75cc729c', 'org-237c40fe8ff17a79'),
  appleretail: idForEnv('org-6970ba034d932903', 'org-0c386c2246a6bebb'),
  hungryhouse: idForEnv('org-714d6d52c2e268ac', 'org-3c557a8ba21a64a5'),
  booking: idForEnv('org-4d6aaae0d30aaa7d', 'org-68bad64fbe9a7fab'),
  atom: idForEnv('org-6c6c57762afd0d79', 'org-593afe99f67b1621'),
  drizly: idForEnv('org-1d159507be3d049e', 'org-6b5289aed25f6390'),
  cheapoair: idForEnv('org-39fc5b25a4debc2e', 'org-293b06d2e5ceef0d'),
  bloomthat: idForEnv('org-717bc2bbb268c3f6', 'org-57714903a5beae6a'),
  seatgeek: idForEnv('org-00eb446216ab549a', 'org-15ca11330e902cdc'),
  caviar: idForEnv('org-4bbe43f218248059', 'org-01d3f23da8897379'),
  itunes: idForEnv('org-08ddcdc47b8479f9', 'org-16e46a4f99ffb60e'),
  uber: idForEnv('org-3f6f45d041e575c0', 'org-233e9d9b676a9ad0'),
  uberrewards: idForEnv('org-71d525a52970fe14', 'org-1be0ab0ff68b10be'),
  deliverydotcom: idForEnv('org-0c9334a8b3947ccc', 'org-1dc9285481600e52'),
};

/**
 * Supported Merchants are the global list of supported merchant hostnames
 * supported by link enhancement/generation.
 *
 * Supported Merchants have the following schema:
 *
 * hostname [string]: The hostname, including subdomains of the merchant
 * organization_id [string]: The Button merchant organization id.
 */
// prettier-ignore
const SUPPORTED_MERCHANTS = [
  { hostname: 'hotels.com', organization_id: ORGANIZATION_IDS.hotelsdotcom },
  { hostname: 'groupon.com', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.co.uk', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'tracking.groupon.com', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.co.uk', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'ebay.com', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'rover.ebay.com', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'walmart.com', organization_id: ORGANIZATION_IDS.walmart },
  { hostname: 'jet.com', organization_id: ORGANIZATION_IDS.jet },
  { hostname: 'boxed.com', organization_id: ORGANIZATION_IDS.boxed },
  { hostname: 'shopspring.com', organization_id: ORGANIZATION_IDS.spring },
  { hostname: 'amazon.com', organization_id: ORGANIZATION_IDS.amazon },
  { hostname: 'apple.com', organization_id: ORGANIZATION_IDS.appleretail },
  { hostname: 'hungryhouse.co.uk', organization_id: ORGANIZATION_IDS.hungryhouse },
  { hostname: 'booking.com', organization_id: ORGANIZATION_IDS.booking },
  { hostname: 'atomtickets.com', organization_id: ORGANIZATION_IDS.atom },
  { hostname: 'drizly.com', organization_id: ORGANIZATION_IDS.drizly },
  { hostname: 'cheapoair.com', organization_id: ORGANIZATION_IDS.cheapoair },
  { hostname: 'bloomthat.com', organization_id: ORGANIZATION_IDS.bloomthat },
  { hostname: 'seatgeek.com', organization_id: ORGANIZATION_IDS.seatgeek },
  { hostname: 'trycaviar.com', organization_id: ORGANIZATION_IDS.caviar },
  { hostname: 'itunes.apple.com', organization_id: ORGANIZATION_IDS.itunes },
  { hostname: 'uber.com', organization_id: ORGANIZATION_IDS.uber },
  { hostname: 'get.uber.com', organization_id: ORGANIZATION_IDS.uberrewards },
  { hostname: 'uk.hotels.com', organization_id: ORGANIZATION_IDS.hotelsdotcom },
  { hostname: 'delivery.com', organization_id: ORGANIZATION_IDS.deliverydotcom },
];

/**
 * Supported Affiliate Query Ids are the global list of supported affililiate
 * identifiers of Button merchants in an affiliate link's query.  For instance,
 * an affiliate link may look like:
 *
 * https://click.linksynergy.com?id=1234
 *
 * If we know "id" maps to a target merchant and in our space a value of "1234"
 * maps to "org-XXX", we'd declaring the following Supported Affiliate Query Id:
 *
 * {
 *   hostname: 'click.linksynergy.com',
 *   key: 'id',
 *   value: '1234',
 *   organization_id: 'org-XXX',
 *   url: 'http://bloop.net.co.uk'
 * }
 *
 * Supported Affiliate Query Ids have the following schema:
 *
 * hostname [string]: The hostname, including subdomains of the affiliate
 * key [string]: The query param key
 * value [string]: The query param value
 * organization_id [string]: The Button merchant organization id.
 * url [string]: The url to use as a destination on match.
 */
const SUPPORTED_AFFILIATE_QUERY_IDS = [];

/**
 * Supported Affiliate Pathname Ids are the global list of supported affiliate
 * identifiers of Button merchants in an affiliate link's pathname.  For
 * instance, an affiliate link may look like:
 *
 * https://quidco.com/visit/US/123
 *
 * If we know in the "US" namespace, id "123" maps to "org-XXX", we'd declare
 * the following Supported Affiliate Pathname Id:
 *
 * {
 *   hostname: 'quidco.com',
 *   regex: String.raw`\/visit\/(\w{2,})\/\(d{1,})`,
 *   matches: [
 *     { values: ['US', '123'], organization_id: 'org-XXX' }
 *   ]
 * }
 *
 * To be returned in an SDK config, the affiliate hostname must also be declared
 * in `SUPPORTED_AFFILIATES`.
 *
 * Supported Affiliate Pathname Ids have the following schema:
 *
 * hostname [string]: The hostname, including subdomains of the affiliate
 * regex [string]: The regex to match a pathname against
 * redirect [boolean]: Whether or not a match indicates the need to follow a
 *   redirect.
 * cacheKey [?function]: A function that accepts a matching url and returns an
 *   appropriate hash identifying the uniqueness of the redirect.
 * matches [array<object>]: The match candidates
 * matches[i].values [array<string>]: The match candidate values
 * matches[i].organization_id [string]: The match candidate organization id
 * matches[i].url [string]: The match candidate target url.  As if this was the
 *   eventual redirect location of the link.
 */
const SUPPORTED_AFFILIATE_PATHNAME_IDS = [
  {
    hostname: 'quidco.com',
    regex: String.raw`(?:^|\/)(?:\w{1,}-)?visit\/(\d{1,})(?:$|\/.*)`,
    redirect: false,
    matches: [
      {
        values: ['6078'],
        organization_id: ORGANIZATION_IDS.groupon,
        url: 'https://www.groupon.co.uk',
      },
      {
        values: ['244'],
        organization_id: ORGANIZATION_IDS.hotelsdotcom,
        url: 'https://www.hotels.com',
      },
      {
        values: ['4439'],
        organization_id: ORGANIZATION_IDS.hungryhouse,
        url: 'https://www.hungryhouse.co.uk',
      },
    ],
  },
  {
    hostname: 'vouchercloud.com',
    regex: String.raw`(?:^|\/)(\w{1,})\/(\w{1,})\/\d{1,}(?:$|\/.*)`,
    redirect: true,
    cacheKey: null,
    matches: [
      {
        values: ['out', 'offer'],
        organization_id: null,
        url: null,
      },
    ],
  },
  {
    hostname: 'groupon.com',
    regex: String.raw`(?:^|\/)(\w{1,})\/(\w{1,})\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:$|\/.*)`,
    redirect: true,
    cacheKey: null,
    matches: [
      {
        values: ['coupons', 'click'],
        organization_id: null,
        url: null,
      },
    ],
  },
];

/**
 * Supported Affiliates are the global list of affiliates supported for link
 * enhancement.  For instance, an affiliate link may look like:
 *
 * https://click.linksynergy.com?url=https%3A%2F%2Fbloop.com
 *
 * where the affiliate link points at a destination url.  We'd support such a
 * link by declaring the following Supported Affiliate:
 *
 * {
 *   hostname: 'click.linksynergy.com',
 *   display_name: 'Rakuten Linkshare',
 *   query_url_keys: [{ key: 'murl' }]
 * }
 *
 * Supported Affiliates have the following schema:
 *
 * hostname [string]: The hostname of the affiliate
 * display_name [string]: A human-readable name for the affiliate partner
 * query_url_keys [Array<object<string, string>>]: An array of objects where the
 *   "key" element is a string representing the key of the url in the
 *   affiliate's query string.
 */
const SUPPORTED_AFFILIATES = [
  {
    hostname: 'click.linksynergy.com',
    display_name: 'Rakuten Linkshare',
    query_url_keys: [{ key: 'murl' }, { key: 'url' }],
  },
  {
    hostname: 'quidco.com',
    display_name: 'Quidco',
    query_url_keys: [],
  },
  {
    hostname: 'vouchercloud.com',
    display_name: 'Vouchercloud',
    query_url_keys: [],
  },
  {
    hostname: 'groupon.com',
    display_name: 'Groupon',
    query_url_keys: [],
  },
];

module.exports = {
  ORGANIZATION_IDS,
  SUPPORTED_MERCHANTS,
  SUPPORTED_AFFILIATE_QUERY_IDS,
  SUPPORTED_AFFILIATE_PATHNAME_IDS,
  SUPPORTED_AFFILIATES,
};
