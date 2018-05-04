const { get } = require('lodash');

const LinkBuilder = require('./link-builder');
const { joinPathname, formatUrl } = require('../lib');

/**
 * # ImpactRadius
 *
 * Supports the following destination object:
 *
 * {
 *   url
 * }
 *
 */
class ImpactRadius extends LinkBuilder {
  merchantRecord() {
    return get(ImpactRadius.MerchantMap, this.merchantId, null);
  }

  getBrowserLink(destination, attributionToken) {
    const { url } = destination;
    const merchantRecord = this.merchantRecord();

    if (!merchantRecord) {
      return null;
    }

    const { hostname, pathId } = merchantRecord;

    return formatUrl({
      protocol: 'http',
      hostname,
      pathname: joinPathname(['c', '415484', pathId]),
      query: {
        subId1: attributionToken,
        subId2: this.publisherId,
        sharedid: this.publisherId,
        u: url,
      },
      slashes: true,
    });
  }

  getDestinationFromUrl(url) {
    return { url };
  }
}

ImpactRadius.AppMappings = [{ match: false }];

ImpactRadius.MerchantMap = {
  'org-24621b367f4280bc': {
    hostname: 'goto.target.com',
    pathId: '81938/2092',
  },
  'org-2bf249f48f5c19e5': {
    hostname: 'goto.target.com',
    pathId: '81938/2092',
  },
  'org-2ef55bcceba936bf': {
    hostname: 'kohls.sjv.io',
    pathId: '362118/5349',
  },
  'org-6084c79ded3b361d': {
    hostname: 'kohls.sjv.io',
    pathId: '362118/5349',
  },
  'org-4c5c4337f5359c9f': {
    hostname: 'janecom.7eer.net',
    pathId: '136645/2703',
  },
  'org-60121fca6f05e8dc': {
    hostname: 'janecom.7eer.net',
    pathId: '136645/2703',
  },
  'org-3bec3b5c0cac44ad': {
    hostname: 'backcountry.pxf.io',
    pathId: '358742/5311',
  },
  'org-14b04cbc05ea9632': {
    hostname: 'backcountry.pxf.io',
    pathId: '358742/5311',
  },
  'org-03418dec42db44bc': {
    hostname: 'hpn.houzz.com',
    pathId: '372747/5454',
  },
  'org-1b931f59516ac887': {
    hostname: 'hpn.houzz.com',
    pathId: '372747/5454',
  },
  'org-7829938c0c640b81': {
    hostname: 'partners.hotwire.com',
    pathId: '205226/3435',
  },
  'org-7b991de7f1a97f15': {
    hostname: 'partners.hotwire.com',
    pathId: '205226/3435',
  },
  'org-66ba5fac108d982a': {
    hostname: 'advance-auto-parts.evyy.net',
    pathId: '89591/2190',
  },
  'org-77cd55d02f3aa0fa': {
    hostname: 'advance-auto-parts.evyy.net',
    pathId: '89591/2190',
  },
  'org-4e1e36560bea827f': {
    hostname: 'blue-apron.evyy.net',
    pathId: '151480/2880',
  },
  'org-54084c2a9ed41a32': {
    hostname: 'blue-apron.evyy.net',
    pathId: '151480/2880',
  },
  'org-2ec030caa66324a1': {
    hostname: 'cabelas.7eer.net',
    pathId: '185932/2623',
  },
  'org-19090e0a7a9430f6': {
    hostname: 'cabelas.7eer.net',
    pathId: '185932/2623',
  },
  'org-3a52110b275c7315': {
    hostname: 'cost-plus-world-market.evyy.net',
    pathId: '84047/2148',
  },
  'org-7c42436567440f84': {
    hostname: 'cost-plus-world-market.evyy.net',
    pathId: '84047/2148',
  },
  'org-2dedd9d0fe73e21e': {
    hostname: 'extendedstayamerica.7eer.net',
    pathId: '285025/4500',
  },
  'org-66699b7f8d07d73a': {
    hostname: 'extendedstayamerica.7eer.net',
    pathId: '285025/4500',
  },
  'org-4f12fbdfceadbd4f': {
    hostname: 'ulta.7eer.net',
    pathId: '164999/3037',
  },
  'org-2777b585ec89b363': {
    hostname: 'ulta.7eer.net',
    pathId: '164999/3037',
  },
  'org-20b58763dc73a0e9': {
    hostname: 'adidas.7eer.net',
    pathId: '264102/4270',
  },
  'org-573265729ae39579': {
    hostname: 'adidas.7eer.net',
    pathId: '264102/4270',
  },
};

module.exports = ImpactRadius;
