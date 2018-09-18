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
  impactPublisherId() {
    return get(ImpactRadius.PublisherMap, this.publisherId, '415484');
  }
  // see comment at bottom re: 415484 publisher ID value

  merchantRecord() {
    return get(ImpactRadius.MerchantMap, this.merchantId, null);
  }

  getBrowserLink(destination, attributionToken) {
    const { url } = destination;
    const merchantRecord = this.merchantRecord();
    const publisherId = this.impactPublisherId();

    if (!merchantRecord) {
      return null;
    }

    const { hostname, pathId } = merchantRecord;

    return formatUrl({
      protocol: 'http',
      hostname,
      pathname: joinPathname(['c', publisherId, pathId]),
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
  'org-20b58763dc73a0e9': {
    hostname: 'adidas.7eer.net',
    pathId: '264102/4270',
  },
  'org-573265729ae39579': {
    hostname: 'adidas.7eer.net',
    pathId: '264102/4270',
  },
  'org-66ba5fac108d982a': {
    hostname: 'advance-auto-parts.evyy.net',
    pathId: '89591/2190',
  },
  'org-77cd55d02f3aa0fa': {
    hostname: 'advance-auto-parts.evyy.net',
    pathId: '89591/2190',
  },
  'org-3bec3b5c0cac44ad': {
    hostname: 'backcountry.pxf.io',
    pathId: '358742/5311',
  },
  'org-14b04cbc05ea9632': {
    hostname: 'backcountry.pxf.io',
    pathId: '358742/5311',
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
  'org-657632e7ef4bd0c5': {
    hostname: 'thechildrensplace.7eer.net',
    pathId: '231481/3971',
  },
  'org-19633f94ba588f4e': {
    hostname: 'thechildrensplace.7eer.net',
    pathId: '231481/3971',
  },
  'org-3a52110b275c7315': {
    hostname: 'cost-plus-world-market.evyy.net',
    pathId: '84047/2148',
  },
  'org-7c42436567440f84': {
    hostname: 'cost-plus-world-market.evyy.net',
    pathId: '84047/2148',
  },
  'org-0332550eb8b15f4d': {
    hostname: 'dicks-sporting-goods.pxf.io',
    pathId: '315573/4835',
  },
  'org-7231d7ace317c483': {
    hostname: 'dicks-sporting-goods.pxf.io',
    pathId: '315573/4835',
  },
  'org-299546bbc4e4986b': {
    hostname: 'partners.enterprise.com',
    pathId: '304337/4720',
  },
  'org-4e63bffcdd3ec5c2': {
    hostname: 'partners.enterprise.com',
    pathId: '304337/4720',
  },
  'org-2dedd9d0fe73e21e': {
    hostname: 'extendedstayamerica.7eer.net',
    pathId: '285025/4500',
  },
  'org-66699b7f8d07d73a': {
    hostname: 'extendedstayamerica.7eer.net',
    pathId: '285025/4500',
  },
  'org-68c46e2d9aec87e7': {
    hostname: 'homedepot.sjv.io',
    pathId: '456723/8154',
  },
  'org-224cb852ef9c94f7': {
    hostname: 'homedepot.sjv.io',
    pathId: '456723/8154',
  },
  'org-7829938c0c640b81': {
    hostname: 'partners.hotwire.com',
    pathId: '205226/3435',
  },
  'org-7b991de7f1a97f15': {
    hostname: 'partners.hotwire.com',
    pathId: '205226/3435',
  },
  'org-03418dec42db44bc': {
    hostname: 'hpn.houzz.com',
    pathId: '372747/5454',
  },
  'org-1b931f59516ac887': {
    hostname: 'hpn.houzz.com',
    pathId: '372747/5454',
  },
  'org-2ef55bcceba936bf': {
    hostname: 'kohls.sjv.io',
    pathId: '362118/5349',
  },
  'org-6084c79ded3b361d': {
    hostname: 'kohls.sjv.io',
    pathId: '362118/5349',
  },
  'org-22e0c0464157d00d': {
    hostname: 'mvmt.7eer.net',
    pathId: '222268/3856',
  },
  'org-049041ef803b7bff': {
    hostname: 'mvmt.7eer.net',
    pathId: '222268/3856',
  },
  'org-24621b367f4280bc': {
    hostname: 'goto.target.com',
    pathId: '81938/2092',
  },
  'org-2bf249f48f5c19e5': {
    hostname: 'goto.target.com',
    pathId: '81938/2092',
  },
  'org-2bcee4484d044026': {
    hostname: 'shipt.sjv.io',
    pathId: '410349/7391',
  },
  'org-0515b8a65fb8f97c': {
    hostname: 'shipt.sjv.io',
    pathId: '410349/7391',
  },
  'org-33fbd5f8fc3214c4': {
    hostname: 'stitch-fix.sjv.io',
    pathId: '477659/8369',
  },
  'org-7f2a65dec2f40c6e': {
    hostname: 'stitch-fix.sjv.io',
    pathId: '477659/8369',
  },
  'org-3c49e594181aec3a': {
    hostname: 'thredup.sjv.io',
    pathId: '418040/7454',
  },
  'org-6917f00190e56f65': {
    hostname: 'thredup.sjv.io',
    pathId: '418040/7454',
  },
  'org-4f12fbdfceadbd4f': {
    hostname: 'ulta.7eer.net',
    pathId: '164999/3037',
  },
  'org-2777b585ec89b363': {
    hostname: 'ulta.7eer.net',
    pathId: '164999/3037',
  },
  'org-1cd5b143f9e24cba': {
    hostname: 'grubhub.pxf.io',
    pathId: '472083/8310',
  },
  'org-52384c00733c60c5': {
    hostname: 'grubhub.pxf.io',
    pathId: '472083/8310',
  },
  'org-12442b0c35f7f8bb': {
    hostname: 'ticketmaster.evyy.net',
    pathId: '264167/4272',
  },
  'org-541729bd3e156a58': {
    hostname: 'ticketmaster.evyy.net',
    pathId: '264167/4272',
  },
  'org-7c8522218d8e2ab8': {
    hostname: 'siriusxm.pxf.io',
    pathId: '302649/4694',
  },
  'org-70e74eb4e490a8f9': {
    hostname: 'siriusxm.pxf.io',
    pathId: '302649/4694',
  },
};

ImpactRadius.PublisherMap = {
  'org-58d6a3bfed7ee019': '1299050', // Earny
  'org-2d432a88b9bb8bda': '415484', // Ibotta
  'org-4738195f8e741d19': '415484', // Samsung Pay
  'org-6e64395169e39796': '415484', // Samsung Pay (Dev)
  'org-030575eddb72b4df': '415484', // Shopkick
  'org-228e2bd288982017': '1299050', // SimpleFund
  'org-7537ad90e42d2ec0': '381635', // Spent
  'org-3eec44df0966f6f0': '415484', // Button Demo (prod)
  'org-63cd58a1a2a8b543': '415484', // Button App Factory (staging)
};

/*
 * Ibotta, Samsung, Shopkick, and Button Demo are all set to 415484 until we
 * are able to split Samsung and Shopkick into their own accounts.
 * Once the split out is complete, Ibotta/Button Demo will continue using 415484.
*/

module.exports = ImpactRadius;
