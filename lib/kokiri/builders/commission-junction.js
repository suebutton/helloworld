const { get } = require('lodash');
const {
  formatUrl,
  joinPathname,
  normalizeHostname,
  orderedQuery,
  parseUrl,
} = require('../lib');
const LinkBuilder = require('./link-builder');

const HOSTNAME_MAP = {
  'oldnavy.com': 'oldnavy.gap.com',
  'bananarepublic.com': 'bananarepublic.gap.com',
  'bananarepublicfactory.com': 'bananarepublicfactory.gapfactory.com',
  'athleta.com': 'athleta.gap.com',
  'loccitane.com': 'usa.loccitane.com',
  'clarks.com': 'clarksusa.com',
};

class CommissionJunction extends LinkBuilder {
  // This builder overrides #action because a large CJ merchant, QVC, has an
  // affiliation issue where if our btn_ref (or any other query param ending in
  // *ref) comes before CJ's ref=CJ1 param in the querystring, QVC doesn't
  // ingest the CJ param. Thus, order of parameters is paramount. CJ has
  // confirmed that this ordering fix does not affect other CJ merchants.
  //
  action(appLink, browserLink) {
    return { app_link: appLink, browser_link: browserLink };
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

    return orderedQuery([{ ref: 'CJ1' }, { btn_tkn: attributionToken }, query]);
  }

  hostname(destination) {
    const { url } = destination;
    const { hostname } = parseUrl(url);

    // CJ outgoing links do not route properly if the hostname passed through
    // is a mobile link (e.g. m.sears.com). Thus, we are replacing m. with
    // www. in the outgoing redirect hostname below.
    return get(
      HOSTNAME_MAP,
      normalizeHostname(hostname),
      hostname.replace(/^m\./, 'www.')
    );
  }

  url(destination) {
    const { url } = destination;
    const { protocol, pathname } = parseUrl(url);

    return formatUrl({
      protocol,
      hostname: this.hostname(destination),
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
      protocol: 'https',
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
}

CommissionJunction.HasButtonWebAffiliation = false;

CommissionJunction.PublisherIdMap = {
  'org-53d10c4742add983': '8903200', // Drop
  'org-58d6a3bfed7ee019': '8889772', // Earny
  'org-2d432a88b9bb8bda': '8415784', // Ibotta
  'org-4738195f8e741d19': '8822964', // Samsung Pay
  'org-6e64395169e39796': '8822964', // Samsung Pay (Dev)
  'org-030575eddb72b4df': '8639622', // Shopkick
  'org-228e2bd288982017': '8889769', // SimpleFund
  'org-7537ad90e42d2ec0': '8730366', // Spent
  'org-69b30e01a38c2373': '8942292', // United Airlines
  'org-2c2d1292816487f1': '8913946', // CoinOut
  'org-7c2c5deb7e65f900': '8985441', // Fanli
};

module.exports = CommissionJunction;
