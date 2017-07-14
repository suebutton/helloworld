const { promiseRequest } = require('./request');

/**
 * The redis cache key, namespaced for redirects.
 *
 * @param  {string} url
 * @return {string}
 */
function urlRedirectKey(url) {
  return `urlredirect:${url}`;
}

const REDIRECT_TTL = 60 * 60 * 24 * 4; // 4 days in seconds

/**
 * Issue a redirect via a redis cache and return final href.  The strategy is:
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
  return redis.getSet(
    urlRedirectKey(cacheKey),
    () => promiseRequest({ url }).then(res => res.request.uri.href),
    REDIRECT_TTL
  );
}

module.exports = {
  redirect,
};
