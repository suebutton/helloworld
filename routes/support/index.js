const Application = require('libbtn/web/app');

const { createValidate } = require('../../lib/validate');
const { bulk } = require('../../lib/bulk');

const validateBody = createValidate([{ key: 'merchant_id' }]);
const { viewAppLinkingSupport } = require('./view');

const { OS_IOS, OS_ANDROID } = require('../../lib/constants');

/**
 * @param  {KokiriAdapter} kokiriAdapter
 * @return {Koa.Router}
 */
module.exports = kokiriAdapter => {
  const router = Application.createRouter();

  const appLinkingSupport = bulk(async (ctx, body) => {
    validateBody(body);

    const { merchant_id: merchantId } = body;

    const examples = kokiriAdapter.exampleLinks(merchantId);
    const supportReport = examples.map(example => {
      const androidSupport = kokiriAdapter.appLinkingSupport(
        OS_ANDROID,
        merchantId,
        example.url
      );
      const iosSupport = kokiriAdapter.appLinkingSupport(
        OS_IOS,
        merchantId,
        example.url
      );
      return viewAppLinkingSupport(example, iosSupport, androidSupport);
    });
    return supportReport;
  });

  router.post('/app-links', appLinkingSupport);

  return router;
};
