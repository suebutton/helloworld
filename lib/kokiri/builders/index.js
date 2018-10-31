const { get } = require('lodash');

const { ORGANIZATION_IDS } = require('../config');
const { KokiriError } = require('../errors');

const Aaptiv = require('./aaptiv');
const Amazon = require('./amazon');
const AppleMusic = require('./apple-music');
const AppleRetail = require('./apple-retail');
const Asos = require('./asos');
const Atom = require('./atom');
const BloomAndWild = require('./bloom-and-wild');
const Bloomthat = require('./bloomthat');
const Booking = require('./booking');
const Boxed = require('./boxed');
const Casper = require('./casper');
const Caviar = require('./caviar');
const Cheapoair = require('./cheapoair');
const CommissionJunction = require('./commission-junction');
const DeliveryDotCom = require('./delivery-dot-com');
const DoorDash = require('./doordash');
const Drizly = require('./drizly');
const Ebags = require('./ebags');
const Ebay = require('./ebay');
const Etsy = require('./etsy');
const Expedia = require('./expedia');
const Groupon = require('./groupon');
const HackShack = require('./hackshack');
const Hollar = require('./hollar');
const HotelsDotCom = require('./hotels-dot-com');
const HotelStorm = require('./hotelstorm');
const HotelTonight = require('./hoteltonight');
const Hotwire = require('./hotwire');
const Houzz = require('./houzz');
const Hungryhouse = require('./hungryhouse');
const ImpactRadius = require('./impact-radius');
const Instacart = require('./instacart');
const Itunes = require('./itunes');
const Jet = require('./jet');
const LinkShare = require('./linkshare');
const Lyft = require('./lyft');
const Minibar = require('./minibar');
const Modcloth = require('./modcloth');
const MrAndMrsSmith = require('./mr-and-mrs-smith');
const OneEightHundredFlowers = require('./1800flowers');
const OpenTable = require('./opentable');
const Overstock = require('./overstock');
const Poshmark = require('./poshmark');
const Quandoo = require('./quandoo');
const Resy = require('./resy');
const Rover = require('./rover');
const Safeway = require('./safeway');
const SamsClub = require('./samsclub');
const Seatgeek = require('./seatgeek');
const Spring = require('./spring');
const Stasher = require('./stasher');
const TestMerchant = require('./test-merchant');
const ThriveMarket = require('./thrive-market');
const Ticketmaster = require('./ticketmaster');
const Tophatter = require('./tophatter');
const Travelocity = require('./travelocity');
const Uber = require('./uber');
const Vividseats = require('./vividseats');
const Walmart = require('./walmart');
const WarbyParker = require('./warby-parker');

const subclassMap = {
  [ORGANIZATION_IDS.aaptiv]: Aaptiv,
  [ORGANIZATION_IDS.abercrombie]: CommissionJunction,
  [ORGANIZATION_IDS.academysports]: CommissionJunction,
  [ORGANIZATION_IDS.aclens]: CommissionJunction,
  [ORGANIZATION_IDS.adidas]: ImpactRadius,
  [ORGANIZATION_IDS.advanceautoparts]: ImpactRadius,
  [ORGANIZATION_IDS.ajmadison]: CommissionJunction,
  [ORGANIZATION_IDS.amazon]: Amazon,
  [ORGANIZATION_IDS.americaneagleoutfitters]: CommissionJunction,
  [ORGANIZATION_IDS.anntaylor]: LinkShare,
  [ORGANIZATION_IDS.anntaylorfactory]: LinkShare,
  [ORGANIZATION_IDS.applemusic]: AppleMusic,
  [ORGANIZATION_IDS.appleretail]: AppleRetail,
  [ORGANIZATION_IDS.asos]: Asos,
  [ORGANIZATION_IDS.ashford]: CommissionJunction,
  [ORGANIZATION_IDS.athleta]: CommissionJunction,
  [ORGANIZATION_IDS.atom]: Atom,
  [ORGANIZATION_IDS.backcountry]: ImpactRadius,
  [ORGANIZATION_IDS.bananarepublic]: CommissionJunction,
  [ORGANIZATION_IDS.bananarepublicfactory]: CommissionJunction,
  [ORGANIZATION_IDS.bareminerals]: LinkShare,
  [ORGANIZATION_IDS.barenecessities]: CommissionJunction,
  [ORGANIZATION_IDS.barnesandnoble]: CommissionJunction,
  [ORGANIZATION_IDS.bassproshops]: CommissionJunction,
  [ORGANIZATION_IDS.bcbg]: LinkShare,
  [ORGANIZATION_IDS.bedbathandbeyond]: CommissionJunction,
  [ORGANIZATION_IDS.belk]: CommissionJunction,
  [ORGANIZATION_IDS.bestbuy]: LinkShare,
  [ORGANIZATION_IDS.bestwestern]: CommissionJunction,
  [ORGANIZATION_IDS.biglots]: CommissionJunction,
  [ORGANIZATION_IDS.bloomandwild]: BloomAndWild,
  [ORGANIZATION_IDS.bloomingdales]: LinkShare,
  [ORGANIZATION_IDS.bloomthat]: Bloomthat,
  [ORGANIZATION_IDS.blueapron]: ImpactRadius,
  [ORGANIZATION_IDS.booking]: Booking,
  [ORGANIZATION_IDS.boxed]: Boxed,
  [ORGANIZATION_IDS.buybuybaby]: CommissionJunction,
  [ORGANIZATION_IDS.cabelas]: ImpactRadius,
  [ORGANIZATION_IDS.catherines]: LinkShare,
  [ORGANIZATION_IDS.casper]: Casper,
  [ORGANIZATION_IDS.caviar]: Caviar,
  [ORGANIZATION_IDS.champs]: LinkShare,
  [ORGANIZATION_IDS.charlotterusse]: LinkShare,
  [ORGANIZATION_IDS.cheapoair]: Cheapoair,
  [ORGANIZATION_IDS.childrensplace]: ImpactRadius,
  [ORGANIZATION_IDS.choicehotels]: CommissionJunction,
  [ORGANIZATION_IDS.clarks]: CommissionJunction,
  [ORGANIZATION_IDS.classpass]: LinkShare,
  [ORGANIZATION_IDS.coach]: LinkShare,
  [ORGANIZATION_IDS.costplusworldmarket]: ImpactRadius,
  [ORGANIZATION_IDS.cratejoy]: ImpactRadius,
  [ORGANIZATION_IDS.deliverydotcom]: DeliveryDotCom,
  [ORGANIZATION_IDS.dickssportinggoods]: ImpactRadius,
  [ORGANIZATION_IDS.drizly]: Drizly,
  [ORGANIZATION_IDS.dollar]: LinkShare,
  [ORGANIZATION_IDS.doordash]: DoorDash,
  [ORGANIZATION_IDS.ebags]: Ebags,
  [ORGANIZATION_IDS.ebay]: Ebay,
  [ORGANIZATION_IDS.eileenfisher]: LinkShare,
  [ORGANIZATION_IDS.eloquii]: CommissionJunction,
  [ORGANIZATION_IDS.enterprise]: ImpactRadius,
  [ORGANIZATION_IDS.etsy]: Etsy,
  [ORGANIZATION_IDS.expedia]: Expedia,
  [ORGANIZATION_IDS.express]: CommissionJunction,
  [ORGANIZATION_IDS.extendedstayamerica]: ImpactRadius,
  [ORGANIZATION_IDS.fandango]: CommissionJunction,
  [ORGANIZATION_IDS.footlocker]: LinkShare,
  [ORGANIZATION_IDS.forevertwentyone]: CommissionJunction,
  [ORGANIZATION_IDS.gamestop]: LinkShare,
  [ORGANIZATION_IDS.gap]: CommissionJunction,
  [ORGANIZATION_IDS.gapfactory]: CommissionJunction,
  [ORGANIZATION_IDS.gnc]: CommissionJunction,
  [ORGANIZATION_IDS.groupon]: Groupon,
  [ORGANIZATION_IDS.grubhub]: ImpactRadius,
  [ORGANIZATION_IDS.hackshack]: HackShack,
  [ORGANIZATION_IDS.hellofresh]: CommissionJunction,
  [ORGANIZATION_IDS.hertz]: CommissionJunction,
  [ORGANIZATION_IDS.hollar]: Hollar,
  [ORGANIZATION_IDS.hollister]: CommissionJunction,
  [ORGANIZATION_IDS.homeaway]: CommissionJunction,
  [ORGANIZATION_IDS.homechef]: CommissionJunction,
  [ORGANIZATION_IDS.homedepot]: ImpactRadius,
  [ORGANIZATION_IDS.hotelsdotcom]: HotelsDotCom,
  [ORGANIZATION_IDS.hotelstorm]: HotelStorm,
  [ORGANIZATION_IDS.hoteltonight]: HotelTonight,
  [ORGANIZATION_IDS.hotwire]: Hotwire,
  [ORGANIZATION_IDS.houzz]: Houzz,
  [ORGANIZATION_IDS.hrblock]: ImpactRadius,
  [ORGANIZATION_IDS.hsn]: CommissionJunction,
  [ORGANIZATION_IDS.hulu]: LinkShare,
  [ORGANIZATION_IDS.hungryhouse]: Hungryhouse,
  [ORGANIZATION_IDS.ihg]: CommissionJunction,
  [ORGANIZATION_IDS.instacart]: Instacart,
  [ORGANIZATION_IDS.itunes]: Itunes,
  [ORGANIZATION_IDS.jcpenney]: CommissionJunction,
  [ORGANIZATION_IDS.jcrew]: CommissionJunction,
  [ORGANIZATION_IDS.jet]: Jet,
  [ORGANIZATION_IDS.kohls]: ImpactRadius,
  [ORGANIZATION_IDS.lanebryant]: LinkShare,
  [ORGANIZATION_IDS.levi]: ImpactRadius,
  [ORGANIZATION_IDS.livingsocial]: CommissionJunction,
  [ORGANIZATION_IDS.loccitane]: CommissionJunction,
  [ORGANIZATION_IDS.loft]: LinkShare,
  [ORGANIZATION_IDS.loftoutlet]: LinkShare,
  [ORGANIZATION_IDS.lordandtaylor]: LinkShare,
  [ORGANIZATION_IDS.lowes]: CommissionJunction,
  [ORGANIZATION_IDS.luckybrand]: CommissionJunction,
  [ORGANIZATION_IDS.lyft]: Lyft,
  [ORGANIZATION_IDS.macys]: LinkShare,
  [ORGANIZATION_IDS.maurices]: LinkShare,
  [ORGANIZATION_IDS.menswearhouse]: LinkShare,
  [ORGANIZATION_IDS.minibar]: Minibar,
  [ORGANIZATION_IDS.modcloth]: Modcloth,
  [ORGANIZATION_IDS.moosejaw]: ImpactRadius,
  [ORGANIZATION_IDS.mrandmrssmith]: MrAndMrsSmith,
  [ORGANIZATION_IDS.murad]: CommissionJunction,
  [ORGANIZATION_IDS.mvmt]: ImpactRadius,
  [ORGANIZATION_IDS.mymms]: CommissionJunction,
  [ORGANIZATION_IDS.nyandcompany]: CommissionJunction,
  [ORGANIZATION_IDS.neimanmarcus]: LinkShare,
  [ORGANIZATION_IDS.newbalance]: LinkShare,
  [ORGANIZATION_IDS.newegg]: CommissionJunction,
  [ORGANIZATION_IDS.nike]: CommissionJunction,
  [ORGANIZATION_IDS.nordstrom]: LinkShare,
  [ORGANIZATION_IDS.officedepot]: CommissionJunction,
  [ORGANIZATION_IDS.oldnavy]: CommissionJunction,
  [ORGANIZATION_IDS.oneeighthundredcontacts]: LinkShare,
  [ORGANIZATION_IDS.oneeighthundredflowers]: OneEightHundredFlowers,
  [ORGANIZATION_IDS.opentable]: OpenTable,
  [ORGANIZATION_IDS.orbitz]: CommissionJunction,
  [ORGANIZATION_IDS.overstock]: Overstock,
  [ORGANIZATION_IDS.payless]: LinkShare,
  [ORGANIZATION_IDS.perfumania]: CommissionJunction,
  [ORGANIZATION_IDS.petcaresupplies]: CommissionJunction,
  [ORGANIZATION_IDS.petco]: CommissionJunction,
  [ORGANIZATION_IDS.petsmart]: LinkShare,
  [ORGANIZATION_IDS.pieroneimports]: CommissionJunction,
  [ORGANIZATION_IDS.poshmark]: Poshmark,
  [ORGANIZATION_IDS.priceline]: CommissionJunction,
  [ORGANIZATION_IDS.priverevaux]: CommissionJunction,
  [ORGANIZATION_IDS.proflowers]: CommissionJunction,
  [ORGANIZATION_IDS.puritanspride]: CommissionJunction,
  [ORGANIZATION_IDS.quandoo]: Quandoo,
  [ORGANIZATION_IDS.qvc]: CommissionJunction,
  [ORGANIZATION_IDS.resy]: Resy,
  [ORGANIZATION_IDS.rentalcarsdotcom]: CommissionJunction,
  [ORGANIZATION_IDS.rover]: Rover,
  [ORGANIZATION_IDS.safeway]: Safeway,
  [ORGANIZATION_IDS.saks]: LinkShare,
  [ORGANIZATION_IDS.samsclub]: SamsClub,
  [ORGANIZATION_IDS.saksfifthavenue]: LinkShare,
  [ORGANIZATION_IDS.samsungdotcom]: CommissionJunction,
  [ORGANIZATION_IDS.sears]: CommissionJunction,
  [ORGANIZATION_IDS.seatgeek]: Seatgeek,
  [ORGANIZATION_IDS.sephora]: LinkShare,
  [ORGANIZATION_IDS.shipt]: ImpactRadius,
  [ORGANIZATION_IDS.shoesdotcom]: LinkShare,
  [ORGANIZATION_IDS.shoeline]: CommissionJunction,
  [ORGANIZATION_IDS.shopdisney]: CommissionJunction,
  [ORGANIZATION_IDS.sierratradingpost]: CommissionJunction,
  [ORGANIZATION_IDS.siriusxm]: ImpactRadius,
  [ORGANIZATION_IDS.sixzerotwo]: LinkShare,
  [ORGANIZATION_IDS.soma]: CommissionJunction,
  [ORGANIZATION_IDS.splendid]: LinkShare,
  [ORGANIZATION_IDS.spring]: Spring,
  [ORGANIZATION_IDS.stasher]: Stasher,
  [ORGANIZATION_IDS.staples]: CommissionJunction,
  [ORGANIZATION_IDS.stitchfix]: ImpactRadius,
  [ORGANIZATION_IDS.target]: ImpactRadius,
  [ORGANIZATION_IDS.techarmor]: LinkShare,
  [ORGANIZATION_IDS.testmerchant]: TestMerchant,
  [ORGANIZATION_IDS.thebodyshop]: LinkShare,
  [ORGANIZATION_IDS.thehonestcompany]: LinkShare,
  [ORGANIZATION_IDS.thelimited]: CommissionJunction,
  [ORGANIZATION_IDS.thredup]: ImpactRadius,
  [ORGANIZATION_IDS.thrifty]: LinkShare,
  [ORGANIZATION_IDS.thrivemarket]: ThriveMarket,
  [ORGANIZATION_IDS.ticketmaster]: Ticketmaster,
  [ORGANIZATION_IDS.tillys]: CommissionJunction,
  [ORGANIZATION_IDS.tophatter]: Tophatter,
  [ORGANIZATION_IDS.travelocity]: Travelocity,
  [ORGANIZATION_IDS.uber]: Uber,
  [ORGANIZATION_IDS.uberrewards]: Uber,
  [ORGANIZATION_IDS.ulta]: ImpactRadius,
  [ORGANIZATION_IDS.underarmour]: CommissionJunction,
  [ORGANIZATION_IDS.vitacost]: LinkShare,
  [ORGANIZATION_IDS.vitaminworld]: ImpactRadius,
  [ORGANIZATION_IDS.vividseats]: Vividseats,
  [ORGANIZATION_IDS.vrbo]: CommissionJunction,
  [ORGANIZATION_IDS.walgreens]: CommissionJunction,
  [ORGANIZATION_IDS.thewalkingcompany]: CommissionJunction,
  [ORGANIZATION_IDS.walmart]: Walmart,
  [ORGANIZATION_IDS.warbyparker]: WarbyParker,
  [ORGANIZATION_IDS.winedotcom]: LinkShare,
  [ORGANIZATION_IDS.yoox]: LinkShare,
  [ORGANIZATION_IDS.zaful]: CommissionJunction,
  [ORGANIZATION_IDS.zulily]: CommissionJunction,
};

/**
 * @param  {KokiriConfig} config
 * @param  {string} publisherId
 * @param  {string} merchantId
 * @return {LinkBuilder} A link builder instance.
 */
function createBuilder(config, publisherId, merchantId) {
  const Cls = get(subclassMap, merchantId);

  if (!Cls) {
    throw new KokiriError(`Unable to resolve builder for ${merchantId}`);
  }

  return new Cls(config, publisherId, merchantId);
}

module.exports = {
  createBuilder,
};
