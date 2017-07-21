const request = require('request');
const { merge } = require('lodash');

const DEFAULT_HEADERS = {
  'User-Agent': 'ButtonBot/1.0',
};

/**
 * Promisify a network request
 *
 * @param  {Object} options request.js options
 * @return {Promise}
 */
function promiseRequest(options) {
  return new Promise((resolve, reject) => {
    request(merge({}, options, { headers: DEFAULT_HEADERS }), (err, res) => {
      if (err) {
        reject(err);
      }

      if (res && res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode}`));
      }

      resolve(res);
    });
  });
}

module.exports = {
  promiseRequest,
};
