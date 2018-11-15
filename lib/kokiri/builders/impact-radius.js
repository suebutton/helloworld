const { get } = require('lodash');

const LinkBuilder = require('./link-builder');
const {
  joinPathname,
  formatUrl,
  normalizeHostname,
  parseUrl,
} = require('../lib');

const HOSTNAME_MAP = {
  'advanceautoparts.com': 'shop.advanceautoparts.com',
};

class ImpactRadius extends LinkBuilder {
  impactPublisherId() {
    // see comment at bottom re: 415484 publisher ID value
    return get(ImpactRadius.PublisherMap, this.publisherId, '415484');
  }

  merchantRecord() {
    return get(ImpactRadius.MerchantMap, this.merchantId, null);
  }

  hostname(destination) {
    const { url } = destination;
    const { hostname } = parseUrl(url);

    return get(HOSTNAME_MAP, normalizeHostname(hostname), hostname);
  }

  url(destination) {
    const { url } = destination;
    const { protocol, pathname, query, hash } = parseUrl(url);

    return formatUrl({
      protocol,
      hostname: this.hostname(destination),
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
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
        u: this.url(destination),
      },
      slashes: true,
    });
  }
}

ImpactRadius.AppMappings = [{ match: false }];
ImpactRadius.HasButtonWebAffiliation = false;

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
  'org-6eada664b6b9c1ea': {
    hostname: 'barkbox.evyy.net',
    pathId: '44431/1369',
  },
  'org-2032542c337350ce': {
    hostname: 'barkbox.evyy.net',
    pathId: '44431/1369',
  },
  'org-4e1e36560bea827f': {
    hostname: 'blue-apron.evyy.net',
    pathId: '151480/2880',
  },
  'org-54084c2a9ed41a32': {
    hostname: 'blue-apron.evyy.net',
    pathId: '151480/2880',
  },
  'org-64202147c39e86cf': {
    hostname: 'c21stores.evyy.net',
    pathId: '261133/4237',
  },
  'org-4a260c81c447c6ef': {
    hostname: 'c21stores.evyy.net',
    pathId: '261133/4237',
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
  'org-0bb1927e6f738505': {
    hostname: 'cratejoy.evyy.net',
    pathId: '277724/4453',
  },
  'org-6dbc9af49ef93d99': {
    hostname: 'cratejoy.evyy.net',
    pathId: '277724/4453',
  },
  'org-0332550eb8b15f4d': {
    hostname: 'dicks-sporting-goods.pxf.io',
    pathId: '315573/4835',
  },
  'org-7231d7ace317c483': {
    hostname: 'dicks-sporting-goods.pxf.io',
    pathId: '315573/4835',
  },
  'org-35646980f9b3169d': {
    hostname: 'dockers.pxf.io',
    pathId: '367788/5411',
  },
  'org-4d103c612492caa3': {
    hostname: 'dockers.pxf.io',
    pathId: '367788/5411',
  },
  'org-6ace1d44dd626012': {
    hostname: 'eddie-bauer-us.sjv.io',
    pathId: '390289/5671',
  },
  'org-00fa1dd4d5187c91': {
    hostname: 'eddie-bauer-us.sjv.io',
    pathId: '390289/5671',
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
  'org-2be6d27b8b94404c': {
    hostname: 'linkto.hrblock.com',
    pathId: '414882/5683',
  },
  'org-3758ea2ed006658e': {
    hostname: 'linkto.hrblock.com',
    pathId: '414882/5683',
  },
  'org-2ef55bcceba936bf': {
    hostname: 'kohls.sjv.io',
    pathId: '362118/5349',
  },
  'org-6084c79ded3b361d': {
    hostname: 'kohls.sjv.io',
    pathId: '362118/5349',
  },
  'org-254cb0fb6da55b06': {
    hostname: 'levis.sjv.io',
    pathId: '366459/5398',
  },
  'org-19510c8daf9627f4': {
    hostname: ' levis.sjv.io',
    pathId: '366459/5398',
  },
  'org-4f3cf7df6b40fac3': {
    hostname: ' moosejaw.evyy.net',
    pathId: '185854/1676',
  },
  'org-353705da535d883f': {
    hostname: ' moosejaw.evyy.net',
    pathId: '185854/1676',
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
  'org-7124d3e9197df177': {
    hostname: 'vitaminworld.evyy.net',
    pathId: '284991/4499',
  },
  'org-3f1ee004c3911b4e': {
    hostname: ' vitaminworld.evyy.net',
    pathId: '284991/4499',
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

// Ibotta, Samsung, Shopkick, and Button Demo are all set to 415484 until we
// are able to split Samsung and Shopkick into their own accounts.
// Once the split out is complete, Ibotta/Button Demo will continue using
// 415484.
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
  'org-2c2d1292816487f1': '1299050', // CoinOut
};

module.exports = ImpactRadius;
