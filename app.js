const Application = require('baseweb/app');
const Router = require('./routes');

/**
 * Creates a properly configured Kokiri Application instance.
 *
 * @param  {Object} options
 * @param  {string} options.port The port to bind to
 * @param  {libbtn.Metrics} options.metrics A metrics instance
 * @param  {libbtn.ErrorLogger} options.errorLogger
 * @param  {boolean} options.logToConsole
 * @param  {Redis} options.redis A redis client A redis client
 * @param  {KokiriAdapter} options.kokiriAdapter
 * @return {BaseWeb.Application} The Application instance
 */
module.exports = options => {
  const {
    port,
    metrics,
    errorLogger,
    logToConsole,
    redis,
    kokiriAdapter,
  } = options;

  const application = new Application({
    port,
    metrics,
    errorLogger,
    logToConsole,
  });

  application.use(Router(redis, kokiriAdapter).routes());

  return application;
};
