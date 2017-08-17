const { get } = require('lodash');

const Amazon = require('./amazon');
const AppleRetail = require('./apple-retail');
const Atom = require('./atom');
const Bloomthat = require('./bloomthat');
const Booking = require('./booking');
const Boxed = require('./boxed');
const Caviar = require('./caviar');
const Cheapoair = require('./cheapoair');
const CommissionJunction = require('./commission-junction');
const DeliveryDotCom = require('./delivery-dot-com');
const Drizly = require('./drizly');
const Ebay = require('./ebay');
const Groupon = require('./groupon');
const HotelsDotCom = require('./hotels-dot-com');
const HotelTonight = require('./hoteltonight');
const Hungryhouse = require('./hungryhouse');
const Itunes = require('./itunes');
const Jet = require('./jet');
const LinkShare = require('./linkshare');
const MrAndMrsSmith = require('./mr-and-mrs-smith');
const Resy = require('./resy');
const Seatgeek = require('./seatgeek');
const Spring = require('./spring');
const Uber = require('./uber');
const Walmart = require('./walmart');

const LinkBuilder = require('./link-builder');

const { ORGANIZATION_IDS } = require('../config');

const subclassMap = {
  [ORGANIZATION_IDS.amazon]: Amazon,
  [ORGANIZATION_IDS.appleretail]: AppleRetail,
  [ORGANIZATION_IDS.atom]: Atom,
  [ORGANIZATION_IDS.bloomthat]: Bloomthat,
  [ORGANIZATION_IDS.booking]: Booking,
  [ORGANIZATION_IDS.boxed]: Boxed,
  [ORGANIZATION_IDS.caviar]: Caviar,
  [ORGANIZATION_IDS.cheapoair]: Cheapoair,
  [ORGANIZATION_IDS.deliverydotcom]: DeliveryDotCom,
  [ORGANIZATION_IDS.drizly]: Drizly,
  [ORGANIZATION_IDS.drizlyCJ]: CommissionJunction,
  [ORGANIZATION_IDS.gap]: CommissionJunction,
  [ORGANIZATION_IDS.qvc]: CommissionJunction,
  [ORGANIZATION_IDS.ebay]: Ebay,
  [ORGANIZATION_IDS.groupon]: Groupon,
  [ORGANIZATION_IDS.hotelsdotcom]: HotelsDotCom,
  [ORGANIZATION_IDS.hoteltonight]: HotelTonight,
  [ORGANIZATION_IDS.hungryhouse]: Hungryhouse,
  [ORGANIZATION_IDS.itunes]: Itunes,
  [ORGANIZATION_IDS.jet]: Jet,
  [ORGANIZATION_IDS.mrandmrssmith]: MrAndMrsSmith,
  [ORGANIZATION_IDS.resy]: Resy,
  [ORGANIZATION_IDS.seatgeek]: Seatgeek,
  [ORGANIZATION_IDS.spring]: Spring,
  [ORGANIZATION_IDS.techarmor]: LinkShare,
  [ORGANIZATION_IDS.uber]: Uber,
  [ORGANIZATION_IDS.uberrewards]: Uber,
  [ORGANIZATION_IDS.walmart]: Walmart,
};

/**
 * @param  {KokiriConfig} config
 * @param  {string} publisherId
 * @param  {string} merchantId
 * @return {LinkBuilder} A link builder instance.
 */
function createBuilder(config, publisherId, merchantId) {
  const Cls = get(subclassMap, merchantId, LinkBuilder);
  return new Cls(config, publisherId, merchantId);
}

module.exports = {
  createBuilder,
};
