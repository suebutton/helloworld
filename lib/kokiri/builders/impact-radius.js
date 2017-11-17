const { get } = require('lodash');

const LinkBuilder = require('./link-builder');
const { joinPathname, formatUrl } = require('../lib');

/**
 * # ImpactRadius
 *
 * Supports the following destination object:
 *
 * {}
 *
 */
class ImpactRadius extends LinkBuilder {
  merchantRecord() {
    return get(ImpactRadius.MerchantMap, this.merchantId, null);
  }

  getBrowserLink(destination, attributionToken) {
    const merchantRecord = this.merchantRecord();

    if (!merchantRecord) {
      return null;
    }

    const { hostname, pathId } = merchantRecord;

    return formatUrl({
      protocol: 'http',
      hostname,
      pathname: joinPathname(['c/415484', pathId]),
      query: {
        subId1: attributionToken,
        subId2: this.publisherId,
        sharedid: this.publisherId,
      },
      slashes: true,
    });
  }

  getPartnerSubomdomain() {
    return null;
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
};

module.exports = ImpactRadius;
