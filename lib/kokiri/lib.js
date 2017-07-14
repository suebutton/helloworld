const { parse, format } = require('url');
const { extend, zip, every, omit, isString } = require('lodash');

const WWW_REGEX = /^www\./;

/**
 * Safely returns a parsed url object.  If not url could be decoded, an empty
 * object or object with many undefined keys will be returned.  Query strings
 * will be parsed to object and their values uri decoded.
 *
 * @param  {string} url The url to parse
 * @return {Object} The parsed url
 */
function parseUrl(url) {
  if (!isString(url)) {
    return {};
  }

  return parse(url, true);
}

/**
 * Utility for joining an array of path components into a pathname.
 *
 * @param  {Array<string>} arr An array of path components
 * @return {string} The pathname
 */
function joinPathname(arr) {
  return arr.filter(a => !!a).join('/');
}

/**
 * Utility for cleaning a pathname
 *
 * @param  {string} pathname
 * @return {string}
 */
function cleanPathname(pathname) {
  return joinPathname((pathname || '').split('/'));
}

/**
 * Formats a urlObject into a url, applying kokiri conventions and normalizations
 * to select fields.
 *
 * @param  {Object}  urlObject A node-style url object
 * @param  {boolean} fixPathname Whether or not to clean up the pathname
 * @return {string}  The formatted url
 */
function formatUrl(urlObject, fixPathname = true) {
  let { pathname } = urlObject;

  if (fixPathname) {
    pathname = cleanPathname(pathname);
  } else if (pathname === '/') {
    pathname = null;
  }

  return format(extend({}, urlObject, { pathname }));
}

/**
 * Strips any leading "www." from hostname and lower cases all characters.
 *
 * @param  {string} hostname A hostname, potentially prefixed with "www."
 * @return {string} the stripped hostname
 */
function normalizeHostname(hostname) {
  return (hostname || '').toLowerCase().replace(WWW_REGEX, '');
}

/**
 * Returns whether or not two hostnames match, irrespective of a leading "www."
 * in either.
 *
 * @param  {string} a The first hostname
 * @param  {string} b The second hostname
 * @return {boolean} whether or not the hostnames match
 */
function isHostnameMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  return normalizeHostname(a) === normalizeHostname(b);
}

/**
 * Returns true iff two arrays have the strictly and shallowly equal values in
 * the same positions.
 *
 * @template T
 * @param  {Array<T>}  a
 * @param  {Array<T>}  b
 * @return {Boolean}
 */
function isArrayMatch(a, b) {
  return every(zip(a, b).map(t => t[0] === t[1]));
}

/**
 * Returns a new query instance with a `btn_ref` set.
 *
 * @param {Object} query
 * @param {string} attributionToken
 * @param {string} btnRefKey
 * @return {Object}
 */
function attributeQuery(query, attributionToken, btnRefKey = 'btn_ref') {
  const affiliationQuery = { [btnRefKey]: attributionToken };

  if (btnRefKey !== 'btn_ref') {
    affiliationQuery.btn_refkey = btnRefKey;
  }

  return extend({}, query, affiliationQuery);
}

function attributeLink(url, attributionToken, btnRefKey) {
  if (!url) {
    return null;
  }

  const parsed = parseUrl(url);

  const locationWithAttribution = extend({}, parsed, {
    query: attributeQuery(parsed.query, attributionToken, btnRefKey),
  });

  return formatUrl(omit(locationWithAttribution, ['search']), false);
}

function urlCacheKey(url) {
  const { protocol, hostname, pathname } = parseUrl(url);

  if (!protocol || !hostname) {
    return url;
  }

  return `${hostname}${pathname}`;
}

module.exports = {
  parseUrl,
  joinPathname,
  cleanPathname,
  formatUrl,
  normalizeHostname,
  isHostnameMatch,
  isArrayMatch,
  attributeQuery,
  attributeLink,
  urlCacheKey,
};
