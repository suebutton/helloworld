const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * LinkShare
 *
 * Supports the following destination object:
 *
 * {
 *   url
 * }
 *
 */
class LinkShare extends LinkBuilder {
  mapLinkShareMerchantId() {
    return LinkShare.MerchantIDMap[this.merchantId] || null;
  }

  mapLinkSharePublisherId() {
    return LinkShare.PublisherIDMap[this.publisherId] || null;
  }

  query(destination, attributionToken) {
    const { url } = destination;
    const mid = this.mapLinkShareMerchantId();
    const id = this.mapLinkSharePublisherId();

    return { id, mid, murl: url, u1: attributionToken };
  }

  getBrowserLink(destination, attributionToken) {
    const mid = this.mapLinkShareMerchantId();
    const id = this.mapLinkSharePublisherId();

    if (mid === null) {
      return null;
    }

    if (id === null) {
      return null;
    }

    return formatUrl({
      protocol: 'https',
      hostname: 'click.linksynergy.com',
      pathname: 'deeplink',
      query: this.query(destination, attributionToken),
      slashes: true,
    });
  }

  getDestinationFromUrl(url) {
    return { url };
  }
}

LinkShare.HasButtonWebAffiliation = false;

LinkShare.MerchantIDMap = {
  'org-59a23eadae467372': '42594', // Bare Minerals prod
  'org-4ee27094fdc44161': '42594', // Bare Minerals staging
  'org-61692ff7cb8a5376': '42568', // BCBG prod
  'org-508eb7aaf7c451a7': '42568', // BCBG staging
  'org-5cb8345a370687eb': '38606', // Best Buy prod
  'org-2a425db995f4b810': '38606', // Best Buy staging
  'org-1f14e042761984b9': '13867', // Bloomingdales prod
  'org-3bf2420ba71a7180': '13867', // Bloomingdales staging
  'org-5e4e92d8088ce5d7': '38598', // Catherines prod
  'org-33705c1d475877d5': '38598', // Catherines staging
  'org-0e5041559a708350': '24515', // Champs production
  'org-536aa54203c3aea1': '24515', // Champs Staging
  'org-0ae78a0118d5b513': '42671', // Charlotte Russe prod
  'org-6e0a8468eea92342': '42671', // Charlotte Russe staging
  'org-236a9999b9362e3c': '37299', // COACH prod
  'org-621b449613ed8b40': '37299', // COACH staging
  'org-56b5669b828c346d': '42820', // Eileen Fisher staging
  'org-2a4fb0b97d5cbd32': '42820', // Eileen Fisher Prod
  'org-4a65238ed2811743': '3071', // Footlocker staging
  'org-0a704e68d9157af0': '3071', // Footlocker prod
  'org-0c642216a15a1f95': '24348', // Gamestop prod
  'org-139f1edad7388c6a': '24348', // Gamestop staging
  'org-58e9067c3af2717f': '42392', // Hulu prod
  'org-0b5f98435860b9c5': '42392', // Hulu staging
  'org-0dd00806d3213c5f': '38549', // Lane Bryant prod
  'org-1aacc5590d521349': '38549', // Lane Bryant staging
  'org-49cb6ac206ad80ef': '3184', // Macy's prod
  'org-7bfb8e7a4771a0f6': '3184', // Macy's staging
  'org-2febb032ab0b051c': '40158', // maurices prod
  'org-654c89095f9023eb': '40158', // maurices staging
  'org-484b829c85cb7afa': '38681', // Payless prod
  'org-701cf78cf127d8bb': '38681', // Payless staging
  'org-7fe1284e246156af': '13565', // Petsmart prod
  'org-737feefaa4027acd': '13565', // Petsmart staging
  'org-6a9507ab7de82b0f': '38801', // Saks Fifth Avenue OFF 5th prod
  'org-467d5b2e0fa71865': '38801', // Saks Fifth Avenue OFF 5th staging
  'org-47583f87f3e1331f': '38733', // Sam's Club prod
  'org-038ecf7c962b91d1': '38733', // Sam's Club staging
  'org-2eeecdfc5daa839a': '2417', // Sephora prod
  'org-5cdc1a582cc682d7': '2417', // Sephora staging
  'org-7bc4103bcd1b31e6': '38891', // Shoes.com prod
  'org-3272edb3586efeb2': '38891', // Shoes.com staging
  'org-407d2f08facfa1a1': '38694', // Six:02 prod
  'org-5a6700ebe4a4895a': '38694', // Six:02 staging
  'org-314afc3876f47d9d': '13962', // The Body Shop prod
  'org-042ed5be9add21b1': '13962', // The Body Shop staging
  'org-7cee09c599d0f13c': '38275', // TechArmor prod
  'org-6ef589c578ab8ac6': '38275', // TechArmor Staging
  'org-2fe99a62e4e627a6': '1155', // Vitacost prod
  'org-70251c891e2511e7': '1155', // Vitacost staging
  'org-5726711398b0f1ad': '2025', // Wine.com prod
  'org-5dd391b9cf84fc26': '2025', // Wine.com staging
  'org-18019d732a7cf04f': '24285', // Yoox prod
  'org-47d17720c94e455e': '24285', // Yoox staging
};

LinkShare.PublisherIDMap = {
  'org-53d10c4742add983': 'v7/Lc7Gpl5Y', // Drop
  'org-58d6a3bfed7ee019': 'SkZTQoM5jLA', // Earny
  'org-2d432a88b9bb8bda': 'BLquFtB2nfI', // Ibotta
  'org-4738195f8e741d19': 'gEO3*xWPBFA', // Samsung Pay
  'org-6e64395169e39796': 'gEO3*xWPBFA', // Samsung Pay (Dev)
  'org-030575eddb72b4df': 'gEO3*xWPBFA', // Shopkick
  'org-228e2bd288982017': 'SkZTQoM5jLA', // SimpleFund
  'org-7537ad90e42d2ec0': 'sBupalAu7iE', // Spent
  'org-3eec44df0966f6f0': 'BLquFtB2nfI', // Button Demo (prod)
  'org-63cd58a1a2a8b543': 'BLquFtB2nfI', // Button App Factory (staging)
};

module.exports = LinkShare;
