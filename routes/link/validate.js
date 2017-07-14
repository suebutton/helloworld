const {
  createValidate,
  validUrl,
  validPlatform,
} = require('../../lib/validate');

const { invalidUrlError, invalidPlatformError } = require('../../lib/errors');

const validateAttributes = createValidate([
  { key: 'publisher_id' },
  { key: 'url' },
  { key: 'url', predicate: validUrl, getError: invalidUrlError },
]);

const validateAppAction = createValidate([
  { key: 'publisher_id' },
  { key: 'url' },
  { key: 'url', predicate: validUrl, getError: invalidUrlError },
  { key: 'platform' },
  { key: 'platform', predicate: validPlatform, getError: invalidPlatformError },
  { key: 'attribution_token' },
]);

const validateUniversal = createValidate([
  { key: 'publisher_id' },
  { key: 'url' },
  { key: 'url', predicate: validUrl, getError: invalidUrlError },
]);

module.exports = {
  validateAttributes,
  validateAppAction,
  validateUniversal,
};
