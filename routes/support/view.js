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
    ios_support: iosSupport,
    android_support: androidSupport,
  };
}

module.exports = {
  viewAppLinkingSupport,
};
