const { get } = require('lodash');

const { joinPathname, formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * Commission Junction
 *
 * Supports the following destination object:
 *
 *
 * {
 *   url
 * }
 *
 */
class CommissionJunction extends LinkBuilder {
  // This builder overrides #appAction and #webAction because we don't want the
  // btn_ref queryparam added to the link.  Because CJ has a strange and invalid
  // linking structure, adding the btn_ref would produce malformed target urls.
  //
  appAction(destination, platform, attributionToken) {
    return {
      app_link: null,
      browser_link: this.getBrowserLink(destination, attributionToken),
    };
  }

  // See note for #appAction
  //
  webAction(destination, platform, attributionToken) {
    return this.appAction(destination, platform, attributionToken);
  }

  cjPublisherId() {
    return get(CommissionJunction.PublisherIdMap, this.publisherId, '8395017');
  }

  pathname(attributionToken) {
    return joinPathname([
      'links',
      this.cjPublisherId(),
      'type',
      'dlg',
      'sid',
      attributionToken,
    ]);
  }

  getBrowserLink(destination, attributionToken) {
    const { url } = destination;
    const baseUrl = formatUrl({
      protocol: 'http',
      hostname: 'www.anrdoezrs.net',
      pathname: this.pathname(attributionToken),
      slashes: true,
    });

    // We have to manually append the target URL onto the CJ link because CJ
    // expects no URL encoding in the target URL.  This is strange and I think
    // violates a web standard somewhere.  Regardless, to properly redirect
    // through CJ, we have to bypass the automatic pathname encoding that will
    // occur using Node's url#format.  The format is always:
    //
    // http://www.anrdoezrs.net/links/:id/type/dlg/sid/:srctok/<Full Partner URL>
    //
    // i.e.
    //
    // http://www.anrdoezrs.net/links/123/type/dlg/sid/srctok-XXX/http://diggy.net/1?a=2
    //
    // will redirect properly to http://diggy.net/1?a=2
    //
    return `${baseUrl}/${url || ''}`;
  }

  getDestinationFromUrl(url) {
    return { url };
  }
}

CommissionJunction.PublisherIdMap = {
  'org-2d432a88b9bb8bda': '8415784', // Ibotta
  'org-030575eddb72b4df': '8639622', // Shopkick
  'org-4738195f8e741d19': '8639622', // Samsung Pay
  'org-6e64395169e39796': '8639622', // Samsung Pay (Dev)
};

module.exports = CommissionJunction;
