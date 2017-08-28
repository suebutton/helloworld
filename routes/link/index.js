const Application = require('libbtn/web/app');

const { bulk } = require('../../lib/bulk');

const {
  validateAttributes,
  validateAppAction,
  validateUniversal,
} = require('./validate');

const {
  viewAttributes,
  viewAppActionWithMeta,
  viewUniveralWithMeta,
} = require('./view');

/**
 * @param  {Redis} redis
 * @param  {KokiriAdapter} kokiriAdapter
 * @return {Koa.Router}
 */
module.exports = (redis, kokiriAdapter) => {
  const router = Application.createRouter();

  const attributes = bulk(async (ctx, body) => {
    validateAttributes(body);

    const { url, publisher_id: publisherId } = body;

    const {
      targetUrl,
      shouldRedirect,
      affiliate,
    } = await kokiriAdapter.maybeRedirect(redis, url);

    const {
      merchantId,
      approved,
      hasIosDeeplink,
      hasAndroidDeeplink,
    } = kokiriAdapter.linkAttributes(targetUrl, publisherId);

    return viewAttributes(
      merchantId,
      approved,
      shouldRedirect,
      affiliate,
      hasIosDeeplink,
      hasAndroidDeeplink
    );
  });

  const appAction = bulk(async (ctx, body) => {
    validateAppAction(body);

    const {
      url,
      publisher_id: publisherId,
      platform,
      attribution_token: attributionToken,
    } = body;

    const { targetUrl, shouldRedirect } = await kokiriAdapter.maybeRedirect(
      redis,
      url
    );

    const { merchantId, approved } = kokiriAdapter.linkAttributes(
      targetUrl,
      publisherId
    );

    const appAction = kokiriAdapter.appAction(
      targetUrl,
      publisherId,
      platform,
      attributionToken,
      ctx,
      url
    );

    return viewAppActionWithMeta(
      merchantId,
      approved,
      shouldRedirect,
      appAction
    );
  });

  const universal = bulk(async (ctx, body) => {
    validateUniversal(body);

    const {
      url,
      publisher_id: publisherId,
      platform,
      attribution_token: attributionToken,
      experience,
    } = body;

    const { targetUrl, shouldRedirect } = await kokiriAdapter.maybeRedirect(
      redis,
      url
    );

    const { merchantId, approved } = kokiriAdapter.linkAttributes(
      targetUrl,
      publisherId
    );

    const universalLink = kokiriAdapter.universalLink(
      targetUrl,
      publisherId,
      platform,
      experience,
      attributionToken,
      ctx,
      url
    );

    return viewUniveralWithMeta(
      merchantId,
      approved,
      shouldRedirect,
      universalLink
    );
  });

  router.post('/attributes', attributes);
  router.post('/app-action', appAction);
  router.post('/universal', universal);

  return router;
};
