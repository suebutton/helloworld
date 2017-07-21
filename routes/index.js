const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');

const Application = require('baseweb/app');

const formatMiddleware = require('../middleware/format');
const requestIdMiddleware = require('../middleware/request-id');

const LinkRouter = require('./link');
const ConfigRouter = require('./config');

const path = require('path');

/**
 * @param  {Redis} redis
 * @param  {KokiriAdapter} kokiriAdapter
 * @return {Koa.Router}
 */
module.exports = (redis, kokiriAdapter) => {
  const router = Application.createRouter();

  router.get('/', serve(path.resolve(__dirname, '../views')));
  router.use(bodyParser());

  router.use(formatMiddleware);
  router.use(requestIdMiddleware);
  router.use('/v1/link', LinkRouter(redis, kokiriAdapter).routes());
  router.use('/v1/config', ConfigRouter(kokiriAdapter).routes());

  return router;
};
