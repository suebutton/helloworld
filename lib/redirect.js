const { parse, format } = require('url');
const { promiseRequest } = require('./request');

const SUCCESS_TTL = 60 * 60 * 24 * 4; // 4 days in seconds
const FAILURE = 'REDIRECT FAILED';

/**
 * If we get an incoming link with port 0, set it to the default port of the
 * given protocol.
 *
 * @param  {string} url
 * @return {string}
 */
function cleanUrl(url) {
  const parsed = parse(url);

  if (parsed.port !== '0') {
    return url;
  }

  parsed.host = null;
  parsed.port = null;

  return format(parsed);
}

/**
 * Returns request.js options for following redirects
 *
 * @param  {string} url
 * @return {Object}
 */
function redirectOptions(url) {
  return {
    url: cleanUrl(url),
    timeout: 1000 * 10, // 10 seconds in milliseconds
    strictSSL: false,
    headers: {
      'User-Agent': 'com.usebutton.redirecter/1.0.0',
      Accept: '*/*',
    },
  };
}

/**
 * Returns a work function that when invoked follows the redirect chain of url.
 * In the event of a failure, work resolves with an error string.
 *
 * @param  {string} url
 * @return {Promise}
 */
function followRedirects(url) {
  return () => {
    return promiseRequest(redirectOptions(url))
      .then(res => res.request.uri.href)
      .catch(() => FAILURE);
  };
}

/**
 * Issues a redirect via a redis cache and returns final href.  The strategy is:
 *
 * 1. Check if the key is in redis.
 *   a. If so, return the value at that key.
 *   b. If not, make the request to the url and persist the result in the cache
 *      at the given key. Return the resulting href.
 *
 * @param  {Redis} redis A Redis instance
 * @param  {string} cacheKey A suitable cache key
 * @param  {string} url The url to redirect
 * @return {Promise}
 */
function redirect(redis, cacheKey, url) {
  return redis
    .getSet('urlredirect', cacheKey, followRedirects(url), () => SUCCESS_TTL)
    .then(res => (res === FAILURE ? null : res));
}

module.exports = {
  redirect,
  FAILURE,
  cleanUrl,
};
