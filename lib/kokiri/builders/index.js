const { get } = require('lodash');

const Ebay = require('./ebay');
const Groupon = require('./groupon');
const HotelsDotCom = require('./hotels-dot-com');
const Walmart = require('./walmart');
const Jet = require('./jet');
const Boxed = require('./boxed');
const Spring = require('./spring');
const Amazon = require('./amazon');
const AppleRetail = require('./apple-retail');
const Hungryhouse = require('./hungryhouse');
const Booking = require('./booking');
const Atom = require('./atom');
const Drizly = require('./drizly');
const Caviar = require('./caviar');
const Cheapoair = require('./cheapoair');
const Seatgeek = require('./seatgeek');
const Bloomthat = require('./bloomthat');
const Itunes = require('./itunes');
const Uber = require('./uber');
const DeliveryDotCom = require('./delivery-dot-com');
const LinkBuilder = require('./link-builder');

const { ORGANIZATION_IDS } = require('../config');

const subclassMap = {
  [ORGANIZATION_IDS.ebay]: Ebay,
  [ORGANIZATION_IDS.groupon]: Groupon,
  [ORGANIZATION_IDS.hotelsdotcom]: HotelsDotCom,
  [ORGANIZATION_IDS.walmart]: Walmart,
  [ORGANIZATION_IDS.jet]: Jet,
  [ORGANIZATION_IDS.boxed]: Boxed,
  [ORGANIZATION_IDS.spring]: Spring,
  [ORGANIZATION_IDS.amazon]: Amazon,
  [ORGANIZATION_IDS.appleretail]: AppleRetail,
  [ORGANIZATION_IDS.hungryhouse]: Hungryhouse,
  [ORGANIZATION_IDS.booking]: Booking,
  [ORGANIZATION_IDS.atom]: Atom,
  [ORGANIZATION_IDS.drizly]: Drizly,
  [ORGANIZATION_IDS.caviar]: Caviar,
  [ORGANIZATION_IDS.cheapoair]: Cheapoair,
  [ORGANIZATION_IDS.seatgeek]: Seatgeek,
  [ORGANIZATION_IDS.bloomthat]: Bloomthat,
  [ORGANIZATION_IDS.itunes]: Itunes,
  [ORGANIZATION_IDS.uber]: Uber,
  [ORGANIZATION_IDS.uberrewards]: Uber,
  [ORGANIZATION_IDS.deliverydotcom]: DeliveryDotCom,
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
