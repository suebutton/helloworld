const { get, isPlainObject } = require('lodash');

/**
 * @param  {string} merchantId
 * @param  {boolean} approved
 * @param  {boolean} shouldRedirect
 * @param  {?Object} affiliate
 * @param  {string} affiliate.hostname
 * @param  {string} affiliate.display_name
 * @param  {?Object} iosAppAction
 * @param  {string} iosAppAction.app_link
 * @param  {string} iosAppAction.browser_link
 * @param  {?Object} androidAppAction
 * @param  {string} iosAppAction.app_link
 * @param  {string} iosAppAction.browser_link
 * @return {Object}
 */
function viewAttributes(
  merchantId,
  approved,
  shouldRedirect,
  affiliate,
  iosAppAction,
  androidAppAction
) {
  const hasIosDeeplink = !!get(iosAppAction, 'app_link');
  const hasAndroidDeeplink = !!get(androidAppAction, 'app_link');

  return {
    merchant_id: merchantId,
    affiliate: viewAffiliate(affiliate),
    approved,
    redirect: shouldRedirect,
    has_ios_deeplink: hasIosDeeplink,
    has_android_deeplink: hasAndroidDeeplink,
  };
}

/**
 * @param  {?Object} affiliate
 * @param  {string} affiliate.hostname
 * @param  {string} affiliate.display_name
 */
function viewAffiliate(affiliate) {
  if (!isPlainObject(affiliate)) {
    return null;
  }

  return {
    display_name: affiliate.display_name || null,
    hostname: affiliate.hostname || null,
  };
}

/**
 * @param  {string} merchantId
 * @param  {boolean} approved
 * @param  {boolean} shouldRedirect
 * @param  {Object} appAction
 * @param  {string} appAction.app_link
 * @param  {string} appAction.browser_link
 * @return {Object}
 */
function viewAppActionWithMeta(
  merchantId,
  approved,
  shouldRedirect,
  appAction
) {
  return {
    merchant_id: merchantId,
    approved,
    redirect: shouldRedirect,
    app_action: viewAppAction(appAction),
  };
}

/**
 * @param  {Object} appAction
 * @param  {string} appAction.app_link
 * @param  {string} appAction.browser_link
 * @return {Object}
 */
function viewAppAction(appAction) {
  if (!isPlainObject(appAction)) {
    return null;
  }

  return {
    app_link: appAction.app_link || null,
    browser_link: appAction.browser_link || null,
  };
}

/**
 * @param  {string} merchantId
 * @param  {boolean} approved
 * @param  {boolean} shouldRedirect
 * @param  {string} universalLink
 * @return {Object}
 */
function viewUniveralWithMeta(
  merchantId,
  approved,
  shouldRedirect,
  universalLink
) {
  return {
    merchant_id: merchantId,
    approved,
    redirect: shouldRedirect,
    universal_link: universalLink,
  };
}

module.exports = {
  viewAttributes,
  viewAppActionWithMeta,
  viewUniveralWithMeta,
};
