const { isPlainObject } = require('lodash');

const { viewSupportMatrix } = require('../link/view');

/**
 * Converts an example link and app linking support to an API response
 * @param  {Object} example, An example link object
 * @param  {Object} iosSupport, App linking support for ios
 * @param  {Object} androidSupport, App linking support for android
 * @return  {Object}, Formatted API response per the docs
 */
function viewAppLinkingSupport(example, iosSupport, androidSupport) {
  return {
    url: example.url,
    label: example.label,
    bucket: example.bucket,
    ios_support: viewAppLinkSupportMatrix(iosSupport),
    android_support: viewAppLinkSupportMatrix(androidSupport),
  };
}

/**
 * @param  {?Object} appLinkSupportMatrix
 * @param  {boolean} appLinkSuportMatrix.appToApp
 * @param  {boolean} appLinkSuportMatrix.webToApp
 * @return {?Object}
 */
function viewAppLinkSupportMatrix(appLinkSupportMatrix) {
  if (!isPlainObject(appLinkSupportMatrix)) {
    return null;
  }

  return {
    app_to_app: appLinkSupportMatrix.appToApp,
    web_to_app: appLinkSupportMatrix.webToApp,
  };
}

/**
 * @param  {?Object} iosSupport
 * @param  {?Object} androidSupport
 * @return {Object}
 */
function viewBaselineSupport(iosSupport, androidSupport) {
  return {
    ios_support: viewSupportMatrix(iosSupport),
    android_support: viewSupportMatrix(androidSupport),
  };
}

module.exports = {
  viewAppLinkingSupport,
  viewBaselineSupport,
};
