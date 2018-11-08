const { parse, format } = require('url');
const { zip, every, omit, isString, pickBy } = require('lodash');
const { stringify } = require('querystring');

const WWW_REGEX = /^www\./;
const BTN_REF = 'btn_ref';
const BTN_TKN = 'btn_tkn';

/**
 * Safely returns a parsed url object.  If not url could be decoded, an empty
 * object or object with many undefined keys will be returned.  Query strings
 * will be parsed to object and their values uri decoded.
 *
 * @param  {string} url The url to parse
 * @param  {boolean} parseQuery Whether or not to parse the querystring into an
 *   Object.
 * @return {Object} The parsed url
 */
function parseUrl(url, parseQuery = true) {
  if (!isString(url)) {
    return {};
  }

  return parse(url, parseQuery);
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
 * Formats a urlObject into a url, applying kokiri conventions and
 * normalizations to select fields.
 *
 * @param  {Object}  urlObject A node-style url object
 * @param  {boolean} fixPathname Whether or not to clean up the pathname
 * @return {string}  The formatted url
 */
function formatUrl(urlObject, fixPathname = true) {
  const { query } = urlObject;
  let { pathname } = urlObject;

  if (fixPathname) {
    pathname = cleanPathname(pathname);
  } else if (pathname === '/') {
    pathname = null;
  }

  return format({ ...urlObject, ...{ pathname, query: compact(query) } });
}

/**
 * Formats a partner subdomain (i.e. 'partner' in 'partner.bttn.io') and
 * urlObject into a url, applying kokiri conventions.
 *
 * @param  {string} partnerSubdomain A partner bttnio subdomain prefix
 * @param  {Object} urlObject A node-style url object
 * @param  {boolean} fixPathname Whether or not to clean up the pathname
 * @return {string} The formatted url
 */
function formatButtonUniversalUrl(partnerSubdomain, urlObject, fixPathname) {
  return formatUrl(
    {
      ...urlObject,
      ...{
        protocol: 'https',
        hostname: `${partnerSubdomain}.bttn.io`,
        slashes: true,
      },
    },
    fixPathname
  );
}

/**
 * Returns a copy of obj with any keys with null values stripped.
 *
 * @param  {Object} obj
 * @param  {Function=} predicate A predicate function to override
 * @return {Object}
 */
function compact(obj, predicate = v => v !== null) {
  return pickBy(obj, predicate);
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
 * Attributes a url with the provided attribution token.
 *
 * When useBtnRef is true, we only want btn_ref to be on links: this tells
 * merchants to affiliate with Button.  When useBtnRef is false, we only want
 * btn_tkn to be on links: merchant's should *not* be sensitive to this
 * parameter and is solely used to signal internally that this link is expected
 * to not affiliate directly with Button.
 *
 * @param  {string} url
 * @param  {string} attributionToken
 # @param  {boolean} useBtnRef
 * @return {string}
 */
function attributeLink(url, attributionToken, useBtnRef = true) {
  if (!url) {
    return null;
  }

  const parsed = parseUrl(url);

  const attributionTokenKey = useBtnRef ? BTN_REF : BTN_TKN;
  const omitAttribtuionTokenKey = useBtnRef ? BTN_TKN : BTN_REF;

  const parsedWithAttribution = {
    ...parsed,
    query: omit({ ...parsed.query, [attributionTokenKey]: attributionToken }, [
      omitAttribtuionTokenKey,
    ]),
  };

  return formatUrl(omit(parsedWithAttribution, ['search']), false);
}

/**
 * Returns a reasonable cache key for a url.
 *
 * @param  {string} url
 * @return {string}
 */
function urlCacheKey(url) {
  const { protocol, hostname, pathname } = parseUrl(url);

  if (!protocol || !hostname) {
    return url;
  }

  return `${hostname}${pathname}`;
}

/**
 * Returns a less minimal Cache key for url.
 *
 * @param  {array} queryBlacklist array of blacklasted query parameters
 * @param  {string} url
 * @return {string}
 */
function urlCacheKeyWithQuery(queryBlacklist = []) {
  return url => {
    const { protocol, hostname, pathname, query } = parseUrl(url);

    if (!protocol || !hostname) {
      return url;
    }

    const queryString = stringify(omit(query, queryBlacklist));

    return `${hostname}${pathname}?${queryString}`;
  };
}

/**
 * Returns a Cache key for an incoming PHG url.
 *
 * @param  {string} url
 * @return {string}
 */
function urlCacheKeyPHG(url) {
  const { protocol, hostname, pathname } = parseUrl(url);

  if (!protocol || !hostname) {
    return url;
  }

  const pathnameRegex = pathname.match(
    /\/creativeref:[^/]+|\/destination:https?[^/]+/
  );
  return `${hostname}${pathnameRegex}`;
}

/** In the case the order of the querystring params matters, orderedQuery
  * returns a querystring with parameters in the order that they are passed
  * to the function.
  @param  {Array<object>} queries An array of objects to be made into an
    ordered querystring
  @return {string} begins with ?, param-value pairs joined by &, and special
    characters URL-encoded
  */
function orderedQuery(queries) {
  const combinedQuery = queries
    .map(query => stringify(query))
    .filter(query => query.length !== 0)
    .join('&');

  if (combinedQuery.length === 0) {
    return '';
  }
  return `?${combinedQuery}`;
}

module.exports = {
  parseUrl,
  joinPathname,
  cleanPathname,
  formatUrl,
  formatButtonUniversalUrl,
  compact,
  normalizeHostname,
  isHostnameMatch,
  isArrayMatch,
  attributeLink,
  urlCacheKey,
  orderedQuery,
  urlCacheKeyWithQuery,
  urlCacheKeyPHG,
};
