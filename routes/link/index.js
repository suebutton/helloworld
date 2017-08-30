const Application = require('libbtn/web/app');

const { bulk } = require('../../lib/bulk');

const {
  validateAttributes,
  validateAppAction,
  validateWebAction,
  validateUniversal,
} = require('./validate');

const {
  viewAttributes,
  viewAppActionWithMeta,
  viewWebActionWithMeta,
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

  const webAction = bulk(async (ctx, body) => {
    validateWebAction(body);

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

    const webAction = kokiriAdapter.webAction(
      targetUrl,
      publisherId,
      platform,
      attributionToken,
      ctx,
      url
    );

    return viewWebActionWithMeta(
      merchantId,
      approved,
      shouldRedirect,
      webAction
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
  router.post('/web-action', webAction);
  router.post('/universal', universal);

  return router;
};
