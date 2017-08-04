const {
  every,
  isPlainObject,
  isFunction,
  mapValues,
  extend,
  zipObject,
} = require('lodash');

const { OS_IOS, OS_ANDROID } = require('../constants');
const { cleanPathname } = require('./lib');

/**
 * This module makes reference to `knownMappings`.  This is a configuration
 * for specifying the mapping between two destination-spaces (likely going from
 * a web destination to an app destination).
 *
 * As a simple example, we may want to map the web destination:
 *
 * /shop/items/123
 *
 * to the app destination:
 *
 * /ShopDetails?itemId=123
 *
 * We could write the following mapping to accomplish this:
 *
 * const knownMappings = [
 *   {
 *     match: (destination) => {
 *       const match = /\/shop\/items\/(\d+)/.exec(destination.pathname);
 *       return match ? { itemId: match[1] } : null;
 *     },
 *     destination: {
 *       pathname: '/ShopDetails',
 *       query: (match) => { itemId: match.itemId }
 *     }
 *   }
 * ]
 *
 * where the `match` is responsible for returning a truthy/falsey value
 * depending on whether or not this candidate matched, and destination is an
 * object used to overwrite certain properties of the incoming destination.
 *
 * It can be used with #mapDestination:
 *
 * mapDestination(
 *   knownMappings,
 *   { pathname: '/shop/items/123', anchor: 2 },
 *   'ios'
 * );
 *
 * // returns { pathname: '/ShopDetails', query: { itemId: 123 }, anchor: 2 }
 *
 * knownMappings is an Array.  It will use the first candidate that matches
 * to perform the mapping.  No other mappings will be invoked.  For this reason,
 * they should be ordered most-restrictive to least.
 *
 * We can define a candidate to be the type of an element of knownMappings.  A
 * candidate has two keys:
 *
 * * `match`: function or value.  If a function, will be invoked with the web
 *   destination and target platform.  If the result of invoking or using match
 *   directly is falsey, it will not be considered a match and we'll move onto
 *   considering the next candidate.  If the result of invoking or using match
 *   directly is truthy, it will be considered a match, and the value will be
 *   passed to all destination mapping functions.
 * * `destination`: Either:
 *   * null: no destination exists, do not mint an app link
 *   * undefined: use the web destination
 *   * An object or arbitrary keys which will be merged on top of the web
 *     destination.  If the value of a given key is a function, it will be
 *     invoked with the match value, the value on the same key in the web
 *     destination, the web destination, and the target platform. If the value
 *     of a given key is not a function, it will be used as the value to merge.
 */

/**
 * If f is a function, invoke it with the rest of the arguments.  If not,
 * return f.
 *
 * @private
 * @param  {*}    f A function to invoke or value to return
 * @param  {Object} context A calling context
 * @param  {...*} rest
 * @return {*}
 */
function invoke(f, context, ...rest) {
  return isFunction(f) ? f.call(context, ...rest) : f;
}

/**
 * Maps a web destination to an app destination for the target platform, if it's
 * well known.
 *
 * @param  {Object}  ctx
 * @param  {Array<Object>}  knownMappings
 * @param  {Object}  destination
 * @param  {string}  platform
 * @return {Object} The app destination
 */
function mapDestination(ctx, knownMappings, destination, platform) {
  if (!knownMappings) {
    return destination;
  }

  return knownMappings.reduce(
    (acc, candidate) => {
      if (acc.match) {
        return acc;
      }

      const match = invoke(candidate.match, ctx, destination, platform);

      if (!match) {
        return acc;
      }

      if (candidate.destination === null) {
        return { match: true, value: null };
      }

      if (!isPlainObject(candidate.destination)) {
        return { match: true, value: destination };
      }

      const appDestination = mapValues(candidate.destination, (d, k) =>
        invoke(d, ctx, match, destination[k], destination, platform)
      );

      return { match: true, value: extend({}, destination, appDestination) };
    },
    { match: false, value: null }
  ).value;
}

/**
 * A matcher function for the homepage.  Only considers pathname.
 *
 * @param  {Object} destination
 * @param  {string} platform
 * @return {boolean}
 */
function matchHomepage(destination) {
  return cleanPathname(destination.pathname) === '';
}

/**
 * @private
 * @param  {string} key
 * @return {Function} A matcher function
 */
function matchString(key) {
  return (regex, matchNames) => destination => {
    const match = regex.exec(destination[key]);

    if (!match) {
      return null;
    }

    return zipObject(matchNames, match.slice(1));
  };
}

/**
 * Higher-order matcher functions for matching a pathname or an anchor in the
 * destination.
 *
 * Invoking with a regex and an array of names for each matching group will
 * return a matcher function that, if matches, returns an object with the passed
 * array as the keys and the extracted values as the keys.
 *
 * e.x.
 *   const matcher = matchPathname(/(\d)-(\d)-(\d)/, ['one', 'two', 'three']);
 *
 *   matcher({ pathname: '1-2-3' })
 *   // returns { 'one': '1', 'two': '2', 'three': '3' }
 *
 */
const matchPathname = matchString('pathname');
const matchAnchor = matchString('anchor');

/**
 * @private
 * @param  {string} desiredPlatform
 * @return {Function} A matcher function
 */
function matchPlatform(desiredPlatform) {
  return (destination, platform) => desiredPlatform === platform;
}

/**
 * matcher functions for ios and android
 */
const matchIOS = matchPlatform(OS_IOS);
const matchAndroid = matchPlatform(OS_ANDROID);

/**
 * Higher-order matcher function for matching a query.  matchQuery accepts
 * an object whose keys are the required query params to be present and whose
 * values are a regex with which to match the value of that query param.
 * Returns false if any of the keys are not present in `requiredQueryParams` or
 * don't match their corresponding regex.
 *
 * e.x.
 *   const matcher = matchQuery({ 'a': /\d{2}/, 'b': /\d{3}/ });
 *
 *   matcher({ query: { a: '22', b: '?' } })
 *   // returns false
 *
 *   matcher({ query: { a: '22', b: '333' } })
 *   // returns true
 *
 * @param  {object<string, regex>} requiredQueryParams
 * @return {Function}
 */
function matchQuery(requiredQueryParams) {
  return destination => {
    if (!isPlainObject(destination.query)) {
      return null;
    }

    return every(
      mapValues(
        requiredQueryParams,
        (regex, key) =>
          key in destination.query && !!regex.exec(destination.query[key])
      )
    );
  };
}

/**
 * Used to compose many matcher functions together.  If any matcher returns
 * a falsey value, the entire sequence will return null.  If all match, any
 * returned objects from the individual matchers will be merged together.
 *
 * Matcher functions have the signature:
 *
 *   (destination: Object, platform: string) => any
 *
 * @param  {...Function} functions The matcher functions to compose
 * @return {Function}  A composed matcher function
 */
function composeMatches(...functions) {
  return (destination, platform) => {
    return functions.reduce((acc, f) => {
      if (acc === null) {
        return null;
      }

      const result = f(destination, platform);

      if (!result) {
        return null;
      }

      return extend({}, acc, result);
    }, {});
  };
}

module.exports = {
  mapDestination,
  matchHomepage,
  matchPathname,
  matchAnchor,
  matchIOS,
  matchAndroid,
  matchQuery,
  composeMatches,
};
