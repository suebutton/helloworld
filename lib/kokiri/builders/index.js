const { get } = require('lodash');

const { ORGANIZATION_IDS } = require('../config');
const { KokiriError } = require('../errors');

const Amazon = require('./amazon');
const AppleMusic = require('./apple-music');
const AppleRetail = require('./apple-retail');
const Atom = require('./atom');
const BloomAndWild = require('./bloom-and-wild');
const Bloomthat = require('./bloomthat');
const Booking = require('./booking');
const Boxed = require('./boxed');
const Caviar = require('./caviar');
const Cheapoair = require('./cheapoair');
const CommissionJunction = require('./commission-junction');
const DeliveryDotCom = require('./delivery-dot-com');
const Drizly = require('./drizly');
const Ebags = require('./ebags');
const Ebay = require('./ebay');
const Groupon = require('./groupon');
const Hollar = require('./hollar');
const HotelsDotCom = require('./hotels-dot-com');
const HotelStorm = require('./hotelstorm');
const HotelTonight = require('./hoteltonight');
const Hungryhouse = require('./hungryhouse');
const ImpactRadius = require('./impact-radius');
const Itunes = require('./itunes');
const Jet = require('./jet');
const LinkShare = require('./linkshare');
const Minibar = require('./minibar');
const Modcloth = require('./modcloth');
const MrAndMrsSmith = require('./mr-and-mrs-smith');
const OneEightHundredFlowers = require('./1800flowers');
const OpenTable = require('./opentable');
const Overstock = require('./overstock');
const Poshmark = require('./poshmark');
const Quandoo = require('./quandoo');
const Resy = require('./resy');
const Seatgeek = require('./seatgeek');
const Spring = require('./spring');
const ThriveMarket = require('./thrive-market');
const Ticketmaster = require('./ticketmaster');
const Uber = require('./uber');
const Walmart = require('./walmart');

const subclassMap = {
  [ORGANIZATION_IDS.amazon]: Amazon,
  [ORGANIZATION_IDS.applemusic]: AppleMusic,
  [ORGANIZATION_IDS.appleretail]: AppleRetail,
  [ORGANIZATION_IDS.atom]: Atom,
  [ORGANIZATION_IDS.backcountry]: ImpactRadius,
  [ORGANIZATION_IDS.bloomandwild]: BloomAndWild,
  [ORGANIZATION_IDS.bloomthat]: Bloomthat,
  [ORGANIZATION_IDS.booking]: Booking,
  [ORGANIZATION_IDS.boxed]: Boxed,
  [ORGANIZATION_IDS.caviar]: Caviar,
  [ORGANIZATION_IDS.cheapoair]: Cheapoair,
  [ORGANIZATION_IDS.deliverydotcom]: DeliveryDotCom,
  [ORGANIZATION_IDS.drizly]: Drizly,
  [ORGANIZATION_IDS.ebags]: Ebags,
  [ORGANIZATION_IDS.ebay]: Ebay,
  [ORGANIZATION_IDS.express]: CommissionJunction,
  [ORGANIZATION_IDS.footlocker]: LinkShare,
  [ORGANIZATION_IDS.gamestop]: LinkShare,
  [ORGANIZATION_IDS.gap]: CommissionJunction,
  [ORGANIZATION_IDS.groupon]: Groupon,
  [ORGANIZATION_IDS.hollar]: Hollar,
  [ORGANIZATION_IDS.hotelsdotcom]: HotelsDotCom,
  [ORGANIZATION_IDS.hotelstorm]: HotelStorm,
  [ORGANIZATION_IDS.hoteltonight]: HotelTonight,
  [ORGANIZATION_IDS.hotwire]: ImpactRadius,
  [ORGANIZATION_IDS.houzz]: ImpactRadius,
  [ORGANIZATION_IDS.hungryhouse]: Hungryhouse,
  [ORGANIZATION_IDS.itunes]: Itunes,
  [ORGANIZATION_IDS.janedotcom]: ImpactRadius,
  [ORGANIZATION_IDS.jet]: Jet,
  [ORGANIZATION_IDS.kohls]: ImpactRadius,
  [ORGANIZATION_IDS.minibar]: Minibar,
  [ORGANIZATION_IDS.modcloth]: Modcloth,
  [ORGANIZATION_IDS.mrandmrssmith]: MrAndMrsSmith,
  [ORGANIZATION_IDS.oneeighthundredflowers]: OneEightHundredFlowers,
  [ORGANIZATION_IDS.opentable]: OpenTable,
  [ORGANIZATION_IDS.overstock]: Overstock,
  [ORGANIZATION_IDS.poshmark]: Poshmark,
  [ORGANIZATION_IDS.quandoo]: Quandoo,
  [ORGANIZATION_IDS.qvc]: CommissionJunction,
  [ORGANIZATION_IDS.resy]: Resy,
  [ORGANIZATION_IDS.seatgeek]: Seatgeek,
  [ORGANIZATION_IDS.spring]: Spring,
  [ORGANIZATION_IDS.stitchfix]: CommissionJunction,
  [ORGANIZATION_IDS.target]: ImpactRadius,
  [ORGANIZATION_IDS.techarmor]: LinkShare,
  [ORGANIZATION_IDS.thrivemarket]: ThriveMarket,
  [ORGANIZATION_IDS.ticketmaster]: Ticketmaster,
  [ORGANIZATION_IDS.uber]: Uber,
  [ORGANIZATION_IDS.uberrewards]: Uber,
  [ORGANIZATION_IDS.underarmour]: CommissionJunction,
  [ORGANIZATION_IDS.walmart]: Walmart,
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
