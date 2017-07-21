const { assign, get, isFunction } = require('lodash');

const App = require('../app');

/**
 * Returns a function compatible as a mocha test handler while allowing the call
 * site to use async/await.
 *
 * @param  {Function} f A function using async/await logic
 * @return {Function}   A mocha test handler
 */
function mochaAsync(f) {
  return function(done) {
    const promise = f.call(this);
    if (isFunction(get(promise, 'then'))) {
      promise.then(done).catch(done);
    } else {
      done();
    }
  };
}

/**
 * Returns an app instance with some handy testing attributes set.
 *
 * @param  {?Object} options Properties to merge
 * @return {Baseweb.App}
 */
function app(options) {
  return App(
    assign(
      {},
      {
        logToConsole: false,
        errorLogger: { installGlobalHandler: () => {}, logError: () => {} },
      },
      options
    )
  );
}

module.exports = {
  mochaAsync,
  app,
};
