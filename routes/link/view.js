const { isPlainObject } = require('lodash');

/**
 * @param  {string} merchantId
 * @param  {boolean} approved
 * @param  {boolean} shouldRedirect
 * @param  {?Object} affiliate
 * @param  {string} affiliate.hostname
 * @param  {string} affiliate.display_name
 * @param  {?Object} iosSupport
 * @param  {?Object} androidSupport
 * @return {Object}
 */
function viewAttributes(
  merchantId,
  approved,
  shouldRedirect,
  affiliate,
  iosSupport,
  androidSupport
) {
  return {
    merchant_id: merchantId,
    affiliate: viewAffiliate(affiliate),
    approved,
    redirect: shouldRedirect,
    ios_support: viewSupportMatrix(iosSupport),
    android_support: viewSupportMatrix(androidSupport),
  };
}

/**
 * @param  {?Object} supportMatrix
 * @param  {boolean} supportMatrix.appToWeb
 * @param  {boolean} supportMatrix.appToApp
 * @param  {boolean} supportMatrix.webToWeb
 * @param  {boolean} supportMatrix.webToApp
 * @param  {boolean} supportMatrix.webToAppWithInstall
 * @return {?Object}
 */
function viewSupportMatrix(supportMatrix) {
  if (!isPlainObject(supportMatrix)) {
    return null;
  }

  return {
    app_to_web: supportMatrix.appToWeb,
    app_to_app: supportMatrix.appToApp,
    web_to_web: supportMatrix.webToWeb,
    web_to_app: supportMatrix.webToApp,
    web_to_app_with_install: supportMatrix.webToAppWithInstall,
  };
}

/**
 * @param  {?Object} affiliate
 * @param  {string} affiliate.hostname
 * @param  {string} affiliate.display_name
 * @return {?Object}
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
 * @return {?Object}
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

module.exports = {
  viewAttributes,
  viewAppActionWithMeta,
  viewWebActionWithMeta,
  viewSupportMatrix,
};
