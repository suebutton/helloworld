const Application = require('libbtn/web/app');

const { createValidate } = require('../../lib/validate');
const { bulk } = require('../../lib/bulk');

const validateBody = createValidate([{ key: 'merchant_id' }]);
const { viewAppLinkingSupport, viewBaselineSupport } = require('./view');

const { OS_IOS, OS_ANDROID } = require('../../lib/constants');
const PLATFORMS = [OS_IOS, OS_ANDROID];

/**
 * @param  {KokiriAdapter} kokiriAdapter
 * @return {Koa.Router}
 */
module.exports = kokiriAdapter => {
  const router = Application.createRouter();

  const appLinkingSupport = bulk(async (ctx, body) => {
    validateBody(body);
    const { merchant_id: merchantId } = body;

    return kokiriAdapter.exampleLinks(merchantId).map(example => {
      const { url } = example;

      const [iosSupport, androidSupport] = PLATFORMS.map(platform =>
        kokiriAdapter.appLinkingSupport(platform, merchantId, url)
      );

      return viewAppLinkingSupport(example, iosSupport, androidSupport);
    });
  });

  const baselineSupport = bulk(async (ctx, body) => {
    validateBody(body);
    const { merchant_id: merchantId } = body;

    const [iosSupport, androidSupport] = PLATFORMS.map(platform =>
      kokiriAdapter.baselineSupport(platform, merchantId)
    );

    return viewBaselineSupport(iosSupport, androidSupport);
  });

  router.post('/app-links', appLinkingSupport);
  router.post('/baseline', baselineSupport);

  return router;
};
