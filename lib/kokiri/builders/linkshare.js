const { get } = require('lodash');
const { formatUrl, normalizeHostname, parseUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

// The below map lets our publishers pass us either URL for a merchant,
// while letting Button choose which one we actually use for routing.
const HOSTNAME_MAP = {
  'nordstrom.com': 'shop.nordstrom.com',
  'tommy.com': 'usa.tommy.com',
};

class LinkShare extends LinkBuilder {
  linkShareMerchantId() {
    return LinkShare.MerchantID[this.merchantId] || null;
  }

  linkSharePublisherId() {
    return LinkShare.PublisherID[this.publisherId] || null;
  }

  hostname(destination) {
    const { hostname } = destination;

    /* While Linkshare routes mobile links correctly in their
   * redirect, this normalization ensures we use the default
   * link as it is the default structure for Linkshare links.
   * And, it reduces the number of urls in the HOSTNAME_MAP.
   */
    return get(
      HOSTNAME_MAP,
      normalizeHostname(hostname),
      hostname.replace(/^m\./, 'www.')
    );
  }

  url(destination) {
    const { url, pathname, query } = destination;
    const { protocol } = parseUrl(url);

    return formatUrl({
      protocol,
      hostname: this.hostname(destination),
      pathname,
      query,
      slashes: true,
    });
  }

  query(destination, attributionToken) {
    const mid = this.linkShareMerchantId();
    const id = this.linkSharePublisherId();

    return { id, mid, murl: this.url(destination), u1: attributionToken };
  }

  getBrowserLink(destination, attributionToken) {
    const mid = this.linkShareMerchantId();
    const id = this.linkSharePublisherId();

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
}

LinkShare.HasButtonWebAffiliation = false;

LinkShare.MerchantID = {
  'org-559d44169f9644b2': '39834', // 1-800 Contacts prod
  'org-26682ada31a5a969': '39834', // 1-800 Contacts staging
  'org-162d3ce006d3730b': '42156', // Ann Taylor prod
  'org-507e4d85331df930': '42156', // Ann Taylor staging
  'org-5aa25a953f24687b': '43432', // Ann Taylor Factory prod
  'org-08eeb5b95eb0a3a9': '43432', // Ann Taylor Factory staging
  'org-59a23eadae467372': '42594', // Bare Minerals prod
  'org-4ee27094fdc44161': '42594', // Bare Minerals staging
  'org-164a6ec17278f215': '38359', // Barneys New York prod
  'org-479a3251aed35628': '38359', // Barneys New York staging
  'org-77e30018f10eda78': '38361', // Barneys Warehouse prod
  'org-6bcaec1ad9d8de3d': '38361', // Barneys Warehouse staging
  'org-61692ff7cb8a5376': '42568', // BCBG prod
  'org-508eb7aaf7c451a7': '42568', // BCBG staging
  'org-5cb8345a370687eb': '38606', // Best Buy prod
  'org-2a425db995f4b810': '38606', // Best Buy staging
  'org-701439f2d721a3ec': '38701', // Birchbox UK prod
  'org-7008040016c309e8': '38701', // Birchbox UK staging
  'org-1f14e042761984b9': '13867', // Bloomingdales prod
  'org-3bf2420ba71a7180': '13867', // Bloomingdales staging
  'org-5e4e92d8088ce5d7': '38598', // Catherines prod
  'org-33705c1d475877d5': '38598', // Catherines staging
  'org-35acd09f1f45171e': '3156', // Champion prod
  'org-3aa400a4ddb52386': '3156', // Champion staging
  'org-0e5041559a708350': '24515', // Champs production
  'org-536aa54203c3aea1': '24515', // Champs Staging
  'org-0ae78a0118d5b513': '42671', // Charlotte Russe prod
  'org-6e0a8468eea92342': '42671', // Charlotte Russe staging
  'org-33560fcb0b67d954': '42482', // ClassPass prod
  'org-118610b4b68e691e': '42482', // ClassPass staging
  'org-236a9999b9362e3c': '37299', // COACH prod
  'org-621b449613ed8b40': '37299', // COACH staging
  'org-591576541710f05c': '35267', // Dollar staging
  'org-22e9e461320816cb': '35267', // Dollar prod
  'org-56b5669b828c346d': '42820', // Eileen Fisher staging
  'org-2a4fb0b97d5cbd32': '42820', // Eileen Fisher Prod
  'org-0224b5d53929da26': '44055', // Eloquii prod
  'org-063ada4cde3b4530': '44055', // Eloquii staging
  'org-04ddb4f5675f8916': '38507', // Famous Footwear prod
  'org-44faa5b122bafdbe': '38507', // Famous Footwear staging
  'org-4a65238ed2811743': '3071', // Footlocker staging
  'org-0a704e68d9157af0': '3071', // Footlocker prod
  'org-396d9d1c6cbaa597': '42508', // Game prod
  'org-41c74011dc2eec5a': '42508', // Game staging
  'org-0c642216a15a1f95': '24348', // Gamestop prod
  'org-139f1edad7388c6a': '24348', // Gamestop staging
  'org-2bcf6eb859912e70': '24366', // Hanes.com prod
  'org-19db578ff508b3d6': '24366', // Hanes.com staging
  'org-3f8b301f55b0c151': '38945', // Happy Socks prod
  'org-45182374654dc7f3': '38945', // Happy Socks staging
  'org-58e9067c3af2717f': '42392', // Hulu prod
  'org-0b5f98435860b9c5': '42392', // Hulu staging
  'org-47bf2bcf5a868be0': '43312', // JOANN prod
  'org-67a62f95dcf52263': '43312', // JOANN staging
  'org-130316c29c7005b7': '37219', // Kobo prod
  'org-04a70b7106b34b47': '37219', // Kobo staging
  'org-0dd00806d3213c5f': '38549', // Lane Bryant prod
  'org-1aacc5590d521349': '38549', // Lane Bryant staging
  'org-6dad864932b6710f': '42157', // LOFT prod
  'org-0b593e51803c750d': '42157', // LOFT staging
  'org-732d8246ae13d753': '43433', // LOFT Outlet prod
  'org-2bea0747eab6b7e4': '43433', // LOFT Outlet staging
  'org-2c5df3adaf2bf9a6': '40480', // Lord & Taylor prod
  'org-0f116a831b9b74ce': '40480', // Lord & Taylor staging
  'org-49cb6ac206ad80ef': '3184', // Macy's prod
  'org-7bfb8e7a4771a0f6': '3184', // Macy's staging
  'org-2febb032ab0b051c': '40158', // maurices prod
  'org-654c89095f9023eb': '40158', // maurices staging
  'org-2707d289a17de31a': '41420', // Men's Warehouse prod
  'org-349d5283e55573dc': '41420', // Men's Warehouse staging
  'org-2aaa7f792e1fd2a4': '25003', // Neiman Marcus prod
  'org-6ed12197d645cb96': '25003', // Neiman Marcus staging
  'org-2820176af1c38fd4': '39756', // New Balance prod
  'org-6d7da004ff5cdcf1': '39756', // New Balance staging
  'org-26d699e4f5d381a7': '1237', // Nordstrom prod
  'org-2f2a3205412f1d16': '1237', // Nordstrom staging
  'org-484b829c85cb7afa': '38681', // Payless prod
  'org-701cf78cf127d8bb': '38681', // Payless staging
  'org-7fe1284e246156af': '13565', // Petsmart prod
  'org-737feefaa4027acd': '13565', // Petsmart staging
  'org-6a9507ab7de82b0f': '38801', // Saks Fifth Avenue OFF 5th prod
  'org-467d5b2e0fa71865': '38801', // Saks Fifth Avenue OFF 5th staging
  'org-1a784c14cfd29642': '13816', // Saks 5th Ave prod
  'org-141dc1b66b1dadd7': '13816', // Saks 5th Ave staging
  'org-2eeecdfc5daa839a': '2417', // Sephora prod
  'org-5cdc1a582cc682d7': '2417', // Sephora staging
  'org-7bc4103bcd1b31e6': '38891', // Shoes.com prod
  'org-3272edb3586efeb2': '38891', // Shoes.com staging
  'org-407d2f08facfa1a1': '38694', // Six:02 prod
  'org-5a6700ebe4a4895a': '38694', // Six:02 staging
  'org-29f053216e87680c': '42623', // Splendid prod
  'org-69e5b82c6aea2750': '42623', // Splendid staging
  'org-5533145e836f8d1d': '37487', // Steve Madden prod
  'org-3f1c7e44c6786515': '37487', // Steve Madden staging
  'org-1c85c47d5dc0ba79': '43794', // Stroller Haus prod
  'org-2cd5465b96631f98': '43794', // Stroller Haus staging
  'org-314afc3876f47d9d': '13962', // The Body Shop prod
  'org-042ed5be9add21b1': '13962', // The Body Shop staging
  'org-6944fb5d855017ea': '37389', // The Honest Company prod
  'org-69f48b3772a0ff50': '37389', // The Honest Company staging
  'org-7cee09c599d0f13c': '38275', // TechArmor prod
  'org-6ef589c578ab8ac6': '38275', // TechArmor Staging
  'org-024abe623b4d34e1': '42666', // Tommy Hilfiger prod
  'org-5bc8da8c2376cde8': '42666', // Tommy Hilfiger staging
  'org-5825c5f407db4141': '38583', // TOMS prod
  'org-17be8043f07b06fe': '38583', // TOMS staging
  'org-76f47bd526dae215': '3088', // Thrifty staging
  'org-6f8e0ae8d4b0f28d': '3088', // Thrifty prod
  'org-5cfcd187a6ea9754': '43912', // UrbanStems prod
  'org-31f1851839b92746': '43912', // UrbanStems staging
  'org-2fe99a62e4e627a6': '1155', // Vitacost prod
  'org-70251c891e2511e7': '1155', // Vitacost staging
  'org-5726711398b0f1ad': '2025', // Wine.com prod
  'org-5dd391b9cf84fc26': '2025', // Wine.com staging
  'org-18019d732a7cf04f': '24285', // Yoox prod
  'org-47d17720c94e455e': '24285', // Yoox staging
};

LinkShare.PublisherID = {
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
  'org-2c2d1292816487f1': 'SkZTQoM5jLA', // CoinOut
  'org-69b30e01a38c2373': 'uhbWdu3Qb7k', // United Airlines
  'org-7c2c5deb7e65f900': 'SkZTQoM5jLA', // Fanli
};

module.exports = LinkShare;
