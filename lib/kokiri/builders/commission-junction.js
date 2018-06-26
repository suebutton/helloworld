const { get } = require('lodash');
const { formatUrl, joinPathname, orderedQuery, parseUrl } = require('../lib');
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
  // This builder overrides #appAction and #webAction because a large CJ merchant,
  // QVC, has an affiliation issue where if our btn_ref=srctok-xxx comes before
  // CJ's ref=CJ1 param in a querystring, QVC doesn't ingest the CJ param. Thus,
  // order of parameters is paramount. CJ has confirmed that this ordering fix
  // does not affect other CJ merchants.
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

  query(destination, attributionToken) {
    const { url } = destination;
    const { query } = parseUrl(url);

    return orderedQuery([{ ref: 'CJ1' }, { btn_ref: attributionToken }, query]);
  }

  url(destination) {
    const { url } = destination;
    const { protocol, hostname, pathname } = parseUrl(url);
    // CJ outgoing links do not route properly if the hostname passed through
    // is a mobile link (e.g. m.sears.com). Sears is the first/only CJ merchant
    // that we have identifed in need of this fix.Thus, we are replacing
    // m. with www. in the outgoing redirect hostname below.
    return formatUrl({
      protocol,
      hostname: hostname.replace(/^m\./, 'www.'),
      pathname,
    });
  }

  hash(destination) {
    const { url } = destination;
    const { hash } = parseUrl(url);

    return hash || '';
  }

  getBrowserLink(destination, attributionToken) {
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
    return `${baseUrl}/${this.url(destination)}${this.query(
      destination,
      attributionToken
    )}${this.hash(destination)}`;
  }

  getDestinationFromUrl(url) {
    return { url };
  }
}

CommissionJunction.PublisherIdMap = {
  'org-2d432a88b9bb8bda': '8415784', // Ibotta
  'org-030575eddb72b4df': '8639622', // Shopkick
  'org-4738195f8e741d19': '8822964', // Samsung Pay
  'org-6e64395169e39796': '8822964', // Samsung Pay (Dev)
};

module.exports = CommissionJunction;
