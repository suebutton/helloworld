// Generic routes for <%= projectName %>

const Router = require('koa-router');

module.exports = function () {
  const router = new Router();

  router.get('/hello', async function (ctx) {
    ctx.body = 'Hello world.';
  });

  return router;
};
