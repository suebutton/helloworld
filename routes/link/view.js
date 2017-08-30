const { isPlainObject } = require('lodash');

/**
 * @param  {string} merchantId
 * @param  {boolean} approved
 * @param  {boolean} shouldRedirect
 * @param  {?Object} affiliate
 * @param  {string} affiliate.hostname
 * @param  {string} affiliate.display_name
 * @param  {boolean} hasIosDeeplink
 * @param  {boolean} hasAndroidDeeplink
 * @return {Object}
 */
function viewAttributes(
  merchantId,
  approved,
  shouldRedirect,
  affiliate,
  hasIosDeeplink,
  hasAndroidDeeplink
) {
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
 * @param  {Object} webAction
 * @param  {string} webAction.app_link
 * @param  {string} webAction.browser_link
 * @return {Object}
 */
function viewWebActionWithMeta(
  merchantId,
  approved,
  shouldRedirect,
  webAction
) {
  return {
    merchant_id: merchantId,
    approved,
    redirect: shouldRedirect,
    web_action: viewWebAction(webAction),
  };
}

/**
 * @param  {Object} webAction
 * @param  {string} webAction.app_link
 * @param  {string} webAction.browser_link
 * @return {Object}
 */
function viewWebAction(webAction) {
  if (!isPlainObject(webAction)) {
    return null;
  }

  return {
    app_link: webAction.app_link || null,
    browser_link: webAction.browser_link || null,
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
  viewWebActionWithMeta,
  viewUniveralWithMeta,
};
