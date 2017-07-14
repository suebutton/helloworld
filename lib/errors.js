const HTTP = require('baseweb/util/http');

function missingArgumentError(argument) {
  const err = new HTTP.BadRequestError(
    `Missing required argument: ${argument}`
  );
  err.type = 'MissingArgument';

  return err;
}

function invalidArgumentError(message) {
  return argument => {
    const err = new HTTP.BadRequestError(
      `Invalid argument: ${argument}; ${message}`
    );

    err.type = 'InvalidArgument';

    return err;
  };
}

const invalidUrlError = invalidArgumentError(
  `couldn't parse protocol and hostname`
);
const invalidPlatformError = invalidArgumentError(
  `must be one of [ios, android]`
);

module.exports = {
  missingArgumentError,
  invalidArgumentError,
  invalidUrlError,
  invalidPlatformError,
};
