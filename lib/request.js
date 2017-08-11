const request = require('request');

/**
 * Promisify a network request
 *
 * @param  {Object} options request.js options
 * @return {Promise}
 */
function promiseRequest(options) {
  return new Promise((resolve, reject) => {
    request(options, (err, res) => {
      if (err) {
        reject(err);
      }

      if (res && res.statusCode >= 500) {
        reject(new Error(`HTTP ${res.statusCode}`));
      }

      resolve(res);
    });
  });
}

module.exports = {
  promiseRequest,
};
