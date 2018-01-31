const { formatUrl } = require('../lib');
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
  mapMerchantIdToCJMerchantId() {
    return CommissionJunction.MerchantIdMap[this.merchantId] || null;
  }

  mapPublisherIdToCJPublisherId() {
    return CommissionJunction.PublisherIdMap[this.publisherId] || '8395017';
  }

  query(destination, attributionToken) {
    const { url } = destination;

    return {
      sid: attributionToken,
      url,
    };
  }

  pathname() {
    const cjMerchantId = this.mapMerchantIdToCJMerchantId();
    if (cjMerchantId === null) {
      return null;
    }

    const cjPublisherId = this.mapPublisherIdToCJPublisherId();

    return `click-${cjPublisherId}-${cjMerchantId}`;
  }

  getBrowserLink(destination, attributionToken) {
    const pathname = this.pathname();
    if (pathname === null) {
      return null;
    }
    return formatUrl({
      protocol: 'http',
      hostname: 'www.dpbolvw.net',
      pathname,
      query: this.query(destination, attributionToken),
      slashes: true,
    });
  }

  getDestinationFromUrl(url) {
    return { url };
  }
}

CommissionJunction.AppMappings = [];

CommissionJunction.MerchantIdMap = {
  'org-319e4a77607c0ae6': '10410849', // Gap staging
  'org-10056a6c4b9f45da': '10410849', // Gap prod
  'org-48b55e692be2e29e': '5965867', // QVC staging
  'org-60b61bf43617aa3a': '5965867', // QVC prod
  'org-33fbd5f8fc3214c4': '12922947', // Stitch Fix staging
  'org-7f2a65dec2f40c6e': '12922947', // Stitch Fix prod
  'org-3acb6dc42678c843': '11393884', // Express staging
  'org-1f8bb66ff44ca946': '11393884', // Express prod
  'org-68f62bd9e3c6299d': '11360763', // Under Armour staging
  'org-4d6fc40af1133350': '11360763', // Under Armour prod
  'org-31ff57a596eb49f0': '4697558', // Abercrombie & Fitch prod
  'org-262d6eae90030df9': '4697558', // Abercrombie & Fitch staging
  'org-169368ab844e1195': '4445720', // American Eagle Outfitters prod
  'org-2e053676e576a192': '4445720', // American Eagle Outfitters staging
  'org-7aa1b253ee576866': '4258829', // Barnes & Noble prod
  'org-61357fd0539adab1': '4258829', // Barnes & Noble staging
  'org-73175357d0c91088': '3055640', // Bed Bath & Beyond prod
  'org-1f3d84fcd15a656b': '3055640', // Bed Bath & Beyond staging
  'org-6918176300ddc5bd': '3971834', // Belk prod
  'org-0d83efbee5076fc4': '3971834', // Belk staging
  'org-7f70aeecd7a3bddb': '1509043', // Choice Hotels prod
  'org-1ca31081509a6894': '1509043', // Choice Hotels staging
  'org-42fe4d75497df756': '4051504', // Clarks prod
  'org-19d71226709fe3c0': '4051504', // Clarks staging
  'org-0224b5d53929da26': '4201370', // ELOQUII prod
  'org-063ada4cde3b4530': '4201370', // ELOQUII staging
  'org-0f7d89295b6c0203': '1420344', // Fandango prod
  'org-335da7cf480ee9ec': '1420344', // Fandango staging
  'org-3e08edd1defc0bb4': '4529306', // Forever 21 prod
  'org-4c453fc80d75912d': '4529306', // Forever 21 staging
  'org-6624191d499647f2': '4851262', // GNC prod
  'org-17129f7d0968289c': '4851262', // GNC staging
  'org-0c1a4a9bdd28984b': '3943014', // HelloFresh prod
  'org-30c1301231586c3a': '3943014', // HelloFresh staging
  'org-2de67cefe5c640d6': '3739701', // Hertz prod
  'org-19b6ce0d40f24fe9': '3739701', // Hertz staging
  'org-5517f820141d30a9': '4396031', // Hollister prod
  'org-55958981cbd6a05e': '4396031', // Hollister staging
  'org-525633e8b040536e': '4644552', // Home Chef prod
  'org-7db8159f970be649': '4644552', // Home Chef staging
  'org-4540d45c863f8d8e': '1461363', // HomeAway prod
  'org-64c93a051955f740': '1461363', // HomeAway staging
  'org-358f3f272215d6ae': '1455022', // HSN prod
  'org-47dd49da0eec165a': '1455022', // HSN staging
  'org-7021ca2bba342684': '3724478', // LivingSocial prod
  'org-3245bc46bdfbde74': '3724478', // LivingSocial staging
  'org-0e75522407c5bc00': '4777835', // Lucky Brand prod
  'org-4646befd71510d10': '4777835', // Lucky Brand staging
  'org-40e671b4821bba85': '4861280', // Orbitz prod
  'org-4a0bc241035d5004': '4861280', // Orbitz staging
  'org-0ac1f4d67d609a28': '1711708', // Petco prod
  'org-37286d1fe134497a': '1711708', // Petco staging
  'org-47313a073be635ef': '4014442', // Pier 1 Imports prod
  'org-1dde8d4ff9bf600b': '4014442', // Pier 1 Imports staging
  'org-647800d57126630c': '1464653', // Priceline prod
  'org-3d58ee483aaab250': '1464653', // Priceline staging
  'org-5775a6ce0795afcb': '4457471', // Swap.com prod
  'org-5a6418c81d0e18af': '4457471', // Swap.com staging
  'org-38f5de379d196cf1': '2691607', // VRBO prod
  'org-356a52da342df057': '2691607', // VRBO staging
  'org-6929d8a51beb9e62': '2568723', // Walgreens prod
  'org-20a3f0e8c6c5ae2c': '2568723', // Walgreens staging
  'org-382ba22e63a6e954': '4777179', // Zaful prod
  'org-2f03d3b932a7efe7': '4777179', // Zaful staging
  'org-07b93b511ac9a4b8': '4859615', // Zulily prod
  'org-49580e02ef6cbea2': '4859615', // Zulily staging
};

CommissionJunction.PublisherIdMap = {
  'org-2d432a88b9bb8bda': '8415784',
};

module.exports = CommissionJunction;
