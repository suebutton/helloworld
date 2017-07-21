const HTTP = require('baseweb/util/http');

/**
 * @param  {string} argument The name of the missing argument
 * @return {HTTP.BadRequestError}
 */
function missingArgumentError(argument) {
  const err = new HTTP.BadRequestError(
    `Missing required argument: ${argument}`
  );

  err.type = 'MissingArgument';
  return err;
}

/**
 * @param  {string} message A message to include
 * @return {Function} A function which creates an HTTP.BadRequestError when
 *   passed the name of the invalid argument
 */
function createInvalidArgumentError(message) {
  return argument => {
    const err = new HTTP.BadRequestError(
      `Invalid argument: ${argument} (${message})`
    );

    err.type = 'InvalidArgument';
    return err;
  };
}

const invalidUrlError = createInvalidArgumentError(
  `couldn't parse protocol and hostname`
);
const invalidPlatformError = createInvalidArgumentError(
  `must be one of [ios, android]`
);

/**
 * @param  {string} url The url that failed redirection
 * @return {HTTP.BadRequestError}
 */
function redirectFailedError(url) {
  const err = new HTTP.BadRequestError(`Failed to follow redirects for ${url}`);

  err.type = 'RedirectFailed';
  return err;
}

module.exports = {
  missingArgumentError,
  invalidUrlError,
  invalidPlatformError,
  redirectFailedError,
};
