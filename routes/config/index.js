const Application = require('libbtn/web/app');

const { createValidate } = require('../../lib/validate');

const validateSdk = createValidate([{ key: 'publisher_id' }]);

/**
 * @param  {KokiriAdapter} kokiriAdapter
 * @return {Koa.Router}
 */
module.exports = kokiriAdapter => {
  const router = Application.createRouter();

  function sdk(ctx) {
    const { body } = ctx.request;
    validateSdk(body);

    const { publisher_id: publisherId } = body;

    ctx.body = kokiriAdapter.sdkConfig(publisherId);
  }

  router.post('/sdk', sdk);

  return router;
};
