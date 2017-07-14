const { parse } = require('url');

const { get, isString } = require('lodash');

const { missingArgumentError } = require('./errors');
const { OS_IOS, OS_ANDROID } = require('./constants');

const truthy = x => !!x;
const supportedPlatforms = new Set([OS_IOS, OS_ANDROID]);

/**
 * Creates a function capable of validating request bodies, given a light
 * schema.  A schema is an array of objects, each describing a predicate that
 * must evaluate to true for the validation to pass.  If the predicate fails,
 * a defined Error will be thrown.
 *
 * @param  {Object[]} schema The schema description
 * @param  {string} schema[].key The key in the request body to evaluate
 * @param  {Function} schema[].predicate A predicate which is passed the value
 *   at schema[].key
 * @param  {Function} schema[].getError A function which is passed the key
 * @return {Function} A function which, when invoked with a request body will
 *   either return undefined if valid or throw and Error if not.
 */
function createValidate(schema) {
  return body => {
    schema.filter(s => !!s.key).forEach(s => {
      if (!get(s, 'predicate', truthy)(body[s.key])) {
        throw get(s, 'getError', missingArgumentError)(s.key);
      }
    });
  };
}

/**
 * @param  {string} url
 * @return {boolean}
 */
function validUrl(url) {
  if (!isString(url)) {
    return false;
  }

  const parsed = parse(url);
  return parsed.hostname && parsed.protocol;
}

/**
 * @param  {string} platform
 * @return {boolean}
 */
function validPlatform(platform) {
  return supportedPlatforms.has(platform);
}

module.exports = {
  createValidate,
  validUrl,
  validPlatform,
};
