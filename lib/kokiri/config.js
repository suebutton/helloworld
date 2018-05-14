/**
 * Returns the org id for the current environment
 *
 * @param  {string} staging
 * @param  {string} production
 * @return {string}
 */
function idForEnv(staging, production) {
  return process.env.NODE_ENV === 'production' ? production : staging;
}

// prettier-ignore
const ORGANIZATION_IDS = {
  aaptiv: idForEnv('org-5857b1e8d8335693', 'org-3208ad66bbc20745'),
  abercrombie: idForEnv('org-262d6eae90030df9', 'org-31ff57a596eb49f0'),
  advanceautoparts: idForEnv('org-77cd55d02f3aa0fa', 'org-66ba5fac108d982a'),
  adidas: idForEnv('org-573265729ae39579', 'org-20b58763dc73a0e9'),
  amazon: idForEnv('org-3b6a623e75cc729c', 'org-237c40fe8ff17a79'),
  americaneagleoutfitters: idForEnv('org-2e053676e576a192', 'org-169368ab844e1195'),
  applemusic: idForEnv('org-7e4081c0d88c5427', 'org-11a5ee63b284a602'),
  appleretail: idForEnv('org-6970ba034d932903', 'org-0c386c2246a6bebb'),
  asos: idForEnv('org-3a546af44d7a007f', 'org-7bf7cc04876c0896'),
  atom: idForEnv('org-6c6c57762afd0d79', 'org-593afe99f67b1621'),
  barnesandnoble: idForEnv('org-61357fd0539adab1', 'org-7aa1b253ee576866'),
  backcountry: idForEnv('org-3bec3b5c0cac44ad', 'org-14b04cbc05ea9632'),
  bedbathandbeyond: idForEnv('org-1f3d84fcd15a656b', 'org-73175357d0c91088'),
  belk: idForEnv('org-0d83efbee5076fc4', 'org-6918176300ddc5bd'),
  bloomandwild: idForEnv('org-2705011eae8616ea', 'org-24c5c0bd6859aafb'),
  bloomthat: idForEnv('org-717bc2bbb268c3f6', 'org-57714903a5beae6a'),
  blueapron: idForEnv('org-54084c2a9ed41a32', 'org-4e1e36560bea827f'),
  booking: idForEnv('org-4d6aaae0d30aaa7d', 'org-68bad64fbe9a7fab'),
  boxed: idForEnv('org-372a59a7b6ddb53b', 'org-1fe24b86920e754b'),
  cabelas: idForEnv('org-19090e0a7a9430f6', 'org-2ec030caa66324a1'),
  catherines: idForEnv('org-33705c1d475877d5', 'org-5e4e92d8088ce5d7'),
  caviar: idForEnv('org-4bbe43f218248059', 'org-01d3f23da8897379'),
  charlotterusse: idForEnv('org-6e0a8468eea92342', 'org-0ae78a0118d5b513'),
  cheapoair: idForEnv('org-39fc5b25a4debc2e', 'org-293b06d2e5ceef0d'),
  choicehotels: idForEnv('org-1ca31081509a6894', 'org-7f70aeecd7a3bddb'),
  clarks: idForEnv('org-19d71226709fe3c0', 'org-42fe4d75497df756'),
  coach: idForEnv('org-621b449613ed8b40', 'org-236a9999b9362e3c'),
  costplusworldmarket: idForEnv('org-7c42436567440f84', 'org-3a52110b275c7315'),
  deliverydotcom: idForEnv('org-0c9334a8b3947ccc', 'org-1dc9285481600e52'),
  doordash: idForEnv('org-11fd3065b9c49c90', 'org-358eb2fe857a41c0'),
  drizly: idForEnv('org-1d159507be3d049e', 'org-6b5289aed25f6390'),
  ebags: idForEnv('org-67cb320e6548dfb3', 'org-370ffc644a4db75f'),
  ebay: idForEnv('org-5d63b849c1d24db2', 'org-6bef1aa726081cf9'),
  eloquii: idForEnv('org-063ada4cde3b4530', 'org-0224b5d53929da26'),
  express: idForEnv('org-3acb6dc42678c843', 'org-1f8bb66ff44ca946'),
  extendedstayamerica: idForEnv('org-66699b7f8d07d73a', 'org-2dedd9d0fe73e21e'),
  etsy: idForEnv('org-3ee55c6f49b96819', 'org-2d6541eb62090c79'),
  fandango: idForEnv('org-335da7cf480ee9ec', 'org-0f7d89295b6c0203'),
  footlocker: idForEnv('org-4a65238ed2811743', 'org-0a704e68d9157af0'),
  forevertwentyone: idForEnv('org-4c453fc80d75912d', 'org-3e08edd1defc0bb4'),
  gamestop: idForEnv('org-139f1edad7388c6a', 'org-0c642216a15a1f95'),
  gap: idForEnv('org-319e4a77607c0ae6', 'org-10056a6c4b9f45da'),
  gnc: idForEnv('org-17129f7d0968289c', 'org-6624191d499647f2'),
  groupon: idForEnv('org-681847bf6cc4d57c', 'org-46cb47cf8637e3d6'),
  hellofresh: idForEnv('org-30c1301231586c3a', 'org-0c1a4a9bdd28984b'),
  hertz: idForEnv('org-19b6ce0d40f24fe9', 'org-2de67cefe5c640d6'),
  hollar: idForEnv('org-6c44299ea17a4656', 'org-6aa99f0dcab1dee1'),
  hollister: idForEnv('org-55958981cbd6a05e', 'org-5517f820141d30a9'),
  homechef: idForEnv('org-7db8159f970be649', 'org-525633e8b040536e'),
  homeaway: idForEnv('org-64c93a051955f740', 'org-4540d45c863f8d8e'),
  hotelsdotcom: idForEnv('org-3573c6b896624279', 'org-3a4aad7eb3f326d0'),
  hotelstorm: idForEnv('org-047a60621cef0d87', 'org-722450a0945f2eb6'),
  hoteltonight: idForEnv('org-36fe49ce9ccb9116', 'org-2a63ae96742c3e1c'),
  hotwire: idForEnv('org-7829938c0c640b81', 'org-7b991de7f1a97f15'),
  houzz: idForEnv('org-03418dec42db44bc', 'org-1b931f59516ac887'),
  hsn: idForEnv('org-47dd49da0eec165a', 'org-358f3f272215d6ae'),
  hulu: idForEnv('org-0b5f98435860b9c5', 'org-58e9067c3af2717f'),
  instacart: idForEnv('org-1b9289f2f9014476', 'org-21a5a7ea2f27bf2f'),
  hungryhouse: idForEnv('org-714d6d52c2e268ac', 'org-3c557a8ba21a64a5'),
  itunes: idForEnv('org-08ddcdc47b8479f9', 'org-16e46a4f99ffb60e'),
  janedotcom: idForEnv('org-4c5c4337f5359c9f', 'org-60121fca6f05e8dc'),
  jcpenney: idForEnv('org-2f11b9727eac5e8b', 'org-7871459c5577c899'),
  jet: idForEnv('org-7edde2ff2a553edd', 'org-01e12b03f6a07d54'),
  kohls: idForEnv('org-2ef55bcceba936bf', 'org-6084c79ded3b361d'),
  lanebryant: idForEnv('org-1aacc5590d521349', 'org-0dd00806d3213c5f'),
  livingsocial: idForEnv('org-3245bc46bdfbde74', 'org-7021ca2bba342684'),
  luckybrand: idForEnv('org-4646befd71510d10', 'org-0e75522407c5bc00'),
  macys: idForEnv('org-7bfb8e7a4771a0f6', 'org-49cb6ac206ad80ef'),
  maurices: idForEnv('org-654c89095f9023eb', 'org-2febb032ab0b051c'),
  minibar: idForEnv('org-6539d5fcc80478f9', 'org-454e774784026cf3'),
  modcloth: idForEnv('org-382484c03d49c2e7', 'org-1273d3ec67e34bc8'),
  mrandmrssmith: idForEnv('org-4a2d4ae6a222295d', 'org-3acd26a72302ef1d'),
  oneeighthundredflowers: idForEnv('org-78f56ab485a9d61e', 'org-2262ebf39b452f55'),
  opentable: idForEnv('org-1381881532ffe9f4', 'org-152a3da601ea842e'),
  orbitz: idForEnv('org-4a0bc241035d5004', 'org-40e671b4821bba85'),
  overstock: idForEnv('org-695642d20753707a', 'org-61f91580f4ee7bd8'),
  petco: idForEnv('org-37286d1fe134497a', 'org-0ac1f4d67d609a28'),
  petsmart: idForEnv('org-737feefaa4027acd', 'org-7fe1284e246156af'),
  pieroneimports: idForEnv('org-1dde8d4ff9bf600b', 'org-47313a073be635ef'),
  poshmark: idForEnv('org-59593cbf9713a5fc', 'org-131504b5b7b2bd8f'),
  priceline: idForEnv('org-3d58ee483aaab250', 'org-647800d57126630c'),
  quandoo: idForEnv('org-6b6a1003c3e5161f', 'org-087998189f5d94a3'),
  qvc: idForEnv('org-48b55e692be2e29e', 'org-60b61bf43617aa3a'),
  resy: idForEnv('org-273ae234ce730ab5', 'org-5bc8df951b113f0b'),
  rover: idForEnv('org-5d21dee9ec7165a7', 'org-5cebfdeeb8931e75'),
  samsclub: idForEnv('org-038ecf7c962b91d1', 'org-47583f87f3e1331f'),
  sears: idForEnv('org-36467c8b060acf5a', 'org-0a83fe21a169704a'),
  seatgeek: idForEnv('org-00eb446216ab549a', 'org-15ca11330e902cdc'),
  sephora: idForEnv('org-5cdc1a582cc682d7', 'org-2eeecdfc5daa839a'),
  shoesdotcom: idForEnv('org-3272edb3586efeb2', 'org-7bc4103bcd1b31e6'),
  shopdisney: idForEnv('org-5112e926c9ede39a', 'org-1a1066d59930fff4'),
  sixzerotwo: idForEnv('org-5a6700ebe4a4895a', 'org-407d2f08facfa1a1'),
  spring: idForEnv('org-5f8137923a8ee6e3', 'org-1205d831b97b8898'),
  stitchfix: idForEnv('org-33fbd5f8fc3214c4', 'org-7f2a65dec2f40c6e'),
  swapdotcom: idForEnv('org-5a6418c81d0e18af', 'org-5775a6ce0795afcb'),
  target: idForEnv('org-24621b367f4280bc', 'org-2bf249f48f5c19e5'),
  techarmor: idForEnv('org-6ef589c578ab8ac6', 'org-7cee09c599d0f13c'),
  thrivemarket: idForEnv('org-013e2e3ddf915475', 'org-11f852b9cd45fedd'),
  ticketmaster: idForEnv('org-12442b0c35f7f8bb', 'org-541729bd3e156a58'),
  uber: idForEnv('org-3f6f45d041e575c0', 'org-233e9d9b676a9ad0'),
  uberrewards: idForEnv('org-71d525a52970fe14', 'org-1be0ab0ff68b10be'),
  ulta: idForEnv('org-2777b585ec89b363', 'org-4f12fbdfceadbd4f'),
  underarmour: idForEnv('org-68f62bd9e3c6299d', 'org-4d6fc40af1133350'),
  vitacost: idForEnv('org-70251c891e2511e7', 'org-2fe99a62e4e627a6'),
  vrbo: idForEnv('org-356a52da342df057', 'org-38f5de379d196cf1'),
  walgreens: idForEnv('org-20a3f0e8c6c5ae2c', 'org-6929d8a51beb9e62'),
  walmart: idForEnv('org-2365a4c935cb296b', 'org-106cb4462581719b'),
  warbyparker: idForEnv('org-2fd15d5ed979b077', 'org-72157f113f3ccc79'),
  winedotcom: idForEnv('org-5dd391b9cf84fc26', 'org-5726711398b0f1ad'),
  yoox: idForEnv('org-47d17720c94e455e', 'org-18019d732a7cf04f'),
  zaful: idForEnv('org-2f03d3b932a7efe7', 'org-382ba22e63a6e954'),
  zulily: idForEnv('org-49580e02ef6cbea2', 'org-07b93b511ac9a4b8'),
  testmerchant: idForEnv('org-02d94d8fe71f12b0', 'org-228b55a5707de5c8'),
};

/**
 * Supported Merchants are the global list of supported merchant hostnames
 * supported by link enhancement/generation.
 *
 * Supported Merchants have the following schema:
 *
 * hostname [string]: The hostname, including subdomains of the merchant
 * organization_id [string]: The Button merchant organization id.
 */
// prettier-ignore
const SUPPORTED_MERCHANTS = [
  { hostname: '1800flowers.com', organization_id: ORGANIZATION_IDS.oneeighthundredflowers },
  { hostname: 'aaptiv.com', organization_id: ORGANIZATION_IDS.aaptiv },
  { hostname: 'abercrombie.com', organization_id: ORGANIZATION_IDS.abercrombie },
  { hostname: 'adidas.com', organization_id: ORGANIZATION_IDS.adidas },
  { hostname: 'advanceautoparts.com', organization_id: ORGANIZATION_IDS.advanceautoparts },
  { hostname: 'ae.com', organization_id: ORGANIZATION_IDS.americaneagleoutfitters },
  { hostname: 'amazon.com', organization_id: ORGANIZATION_IDS.amazon },
  { hostname: 'apple.com', organization_id: ORGANIZATION_IDS.appleretail },
  { hostname: 'asos.com', organization_id: ORGANIZATION_IDS.asos },
  { hostname: 'atomtickets.com', organization_id: ORGANIZATION_IDS.atom },
  { hostname: 'backcountry.com', organization_id: ORGANIZATION_IDS.backcountry },
  { hostname: 'barnesandnoble.com', organization_id: ORGANIZATION_IDS.barnesandnoble },
  { hostname: 'bedbathandbeyond.com', organization_id: ORGANIZATION_IDS.bedbathandbeyond },
  { hostname: 'belk.com', organization_id: ORGANIZATION_IDS.belk },
  { hostname: 'bloomandwild.com', organization_id: ORGANIZATION_IDS.bloomandwild },
  { hostname: 'bloomthat.com', organization_id: ORGANIZATION_IDS.bloomthat },
  { hostname: 'blueapron.com', organization_id: ORGANIZATION_IDS.blueapron },
  { hostname: 'booking.com', organization_id: ORGANIZATION_IDS.booking },
  { hostname: 'boxed.com', organization_id: ORGANIZATION_IDS.boxed },
  { hostname: 'cabelas.com', organization_id: ORGANIZATION_IDS.cabelas },
  { hostname: 'catherines.com', organization_id: ORGANIZATION_IDS.catherines },
  { hostname: 'charlotterusse.com', organization_id: ORGANIZATION_IDS.charlotterusse },
  { hostname: 'cheapoair.com', organization_id: ORGANIZATION_IDS.cheapoair },
  { hostname: 'choicehotels.com', organization_id: ORGANIZATION_IDS.choicehotels },
  { hostname: 'clarksusa.com', organization_id: ORGANIZATION_IDS.clarks },
  { hostname: 'coach.com', organization_id: ORGANIZATION_IDS.coach },
  { hostname: 'delivery.com', organization_id: ORGANIZATION_IDS.deliverydotcom },
  { hostname: 'doordash.com', organization_id: ORGANIZATION_IDS.doordash },
  { hostname: 'drizly.com', organization_id: ORGANIZATION_IDS.drizly },
  { hostname: 'ebags.com', organization_id: ORGANIZATION_IDS.ebags },
  { hostname: 'ebay.at', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.be', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.ca', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.ch', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.co.uk', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.com', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.com.au', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.de', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.es', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.fr', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.ie', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.it', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'ebay.nl', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'eloquii.com', organization_id: ORGANIZATION_IDS.eloquii },
  { hostname: 'etsy.com', organization_id: ORGANIZATION_IDS.etsy },
  { hostname: 'express.com', organization_id: ORGANIZATION_IDS.express },
  { hostname: 'extendedstayamerica.com', organization_id: ORGANIZATION_IDS.extendedstayamerica },
  { hostname: 'fandango.com', organization_id: ORGANIZATION_IDS.fandango },
  { hostname: 'footlocker.com', organization_id: ORGANIZATION_IDS.footlocker },
  { hostname: 'forever21.com', organization_id: ORGANIZATION_IDS.forevertwentyone },
  { hostname: 'gamestop.com', organization_id: ORGANIZATION_IDS.gamestop },
  { hostname: 'gap.com', organization_id: ORGANIZATION_IDS.gap },
  { hostname: 'get.uber.com', organization_id: ORGANIZATION_IDS.uberrewards },
  { hostname: 'gnc.com', organization_id: ORGANIZATION_IDS.gnc },
  { hostname: 'groupon.ae', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.com.au', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.be', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.de', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.es', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.fr', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.ie', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.it', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.nl', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'grouponnz.co.nz', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.pl', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.co.uk', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'groupon.com', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'hellofresh.com', organization_id: ORGANIZATION_IDS.hellofresh },
  { hostname: 'hertz.com', organization_id: ORGANIZATION_IDS.hertz },
  { hostname: 'hollisterco.com', organization_id: ORGANIZATION_IDS.hollister },
  { hostname: 'hollar.com', organization_id: ORGANIZATION_IDS.hollar },
  { hostname: 'homechef.com', organization_id: ORGANIZATION_IDS.homechef },
  { hostname: 'homeaway.com', organization_id: ORGANIZATION_IDS.homeaway },
  { hostname: 'hsn.com', organization_id: ORGANIZATION_IDS.hsn },
  { hostname: 'hotels.com', organization_id: ORGANIZATION_IDS.hotelsdotcom },
  { hostname: 'hotelstorm.com', organization_id: ORGANIZATION_IDS.hotelstorm },
  { hostname: 'hoteltonight.com', organization_id: ORGANIZATION_IDS.hoteltonight },
  { hostname: 'hotwire.com', organization_id: ORGANIZATION_IDS.hotwire },
  { hostname: 'houzz.com', organization_id: ORGANIZATION_IDS.houzz },
  { hostname: 'hulu.com', organization_id: ORGANIZATION_IDS.hulu },
  { hostname: 'hungryhouse.co.uk', organization_id: ORGANIZATION_IDS.hungryhouse },
  { hostname: 'instacart.com', organization_id: ORGANIZATION_IDS.instacart },
  { hostname: 'itunes.apple.com', organization_id: ORGANIZATION_IDS.applemusic },
  { hostname: 'itunes.apple.com', query_regex: String.raw`(?:^|&)app=itunes(?:&|$)`, organization_id: ORGANIZATION_IDS.itunes },
  { hostname: 'jane.com', organization_id: ORGANIZATION_IDS.janedotcom },
  { hostname: 'jcpenney.com', organization_id: ORGANIZATION_IDS.jcpenney },
  { hostname: 'jet.com', organization_id: ORGANIZATION_IDS.jet },
  { hostname: 'kohls.com', organization_id: ORGANIZATION_IDS.kohls },
  { hostname: 'lanebryant.com', organization_id: ORGANIZATION_IDS.lanebryant },
  { hostname: 'livingsocial.com', organization_id: ORGANIZATION_IDS.livingsocial },
  { hostname: 'luckybrand.com', organization_id: ORGANIZATION_IDS.luckybrand },
  { hostname: 'm.asos.com', organization_id: ORGANIZATION_IDS.asos },
  { hostname: 'm.ebay.at', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.be', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.ca', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.ch', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.co.uk', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.com', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.com.au', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.de', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.es', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.fr', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.ie', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.it', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'm.ebay.nl', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'macys.com', organization_id: ORGANIZATION_IDS.macys },
  { hostname: 'maurices.com', organization_id: ORGANIZATION_IDS.maurices },
  { hostname: 'minibardelivery.com', organization_id: ORGANIZATION_IDS.minibar },
  { hostname: 'modcloth.com', organization_id: ORGANIZATION_IDS.modcloth },
  { hostname: 'mrandmrssmith.com', organization_id: ORGANIZATION_IDS.mrandmrssmith },
  { hostname: 'opentable.com', organization_id: ORGANIZATION_IDS.opentable },
  { hostname: 'orbitz.com', organization_id: ORGANIZATION_IDS.orbitz },
  { hostname: 'overstock.com', organization_id: ORGANIZATION_IDS.overstock },
  { hostname: 'petco.com', organization_id: ORGANIZATION_IDS.petco },
  { hostname: 'petsmart.com', organization_id: ORGANIZATION_IDS.petsmart },
  { hostname: 'pier1.com', organization_id: ORGANIZATION_IDS.pieroneimports },
  { hostname: 'poshmark.com', organization_id: ORGANIZATION_IDS.poshmark },
  { hostname: 'priceline.com', organization_id: ORGANIZATION_IDS.priceline },
  { hostname: 'quandoo.sg', organization_id: ORGANIZATION_IDS.quandoo },
  { hostname: 'qvc.com', organization_id: ORGANIZATION_IDS.qvc },
  { hostname: 'resy.com', organization_id: ORGANIZATION_IDS.resy },
  { hostname: 'rover.com', organization_id: ORGANIZATION_IDS.rover },
  { hostname: 'rover.ebay.com', organization_id: ORGANIZATION_IDS.ebay },
  { hostname: 'samsclub.com', organization_id: ORGANIZATION_IDS.samsclub },
  { hostname: 'sears.com', organization_id: ORGANIZATION_IDS.sears },
  { hostname: 'seatgeek.com', organization_id: ORGANIZATION_IDS.seatgeek },
  { hostname: 'sephora.com', organization_id: ORGANIZATION_IDS.sephora },
  { hostname: 'shoes.com', organization_id: ORGANIZATION_IDS.shoesdotcom },
  { hostname: 'shopdisney.com', organization_id: ORGANIZATION_IDS.shopdisney },
  { hostname: 'shopspring.com', organization_id: ORGANIZATION_IDS.spring },
  { hostname: 'six02.com', organization_id: ORGANIZATION_IDS.sixzerotwo },
  { hostname: 'stitchfix.com', organization_id: ORGANIZATION_IDS.stitchfix },
  { hostname: 'swap.com', organization_id: ORGANIZATION_IDS.swapdotcom },
  { hostname: 't.groupon.co.uk', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.ae', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.com.au', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.be', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.de', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.es', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.fr', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.ie', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.it', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.nl', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.grouponnz.co.nz', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 't.groupon.pl', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'target.com', organization_id: ORGANIZATION_IDS.target },
  { hostname: 'techarmor.com', organization_id: ORGANIZATION_IDS.techarmor },
  { hostname: 'thrivemarket.com', organization_id: ORGANIZATION_IDS.thrivemarket },
  { hostname: 'ticketmaster.com', organization_id: ORGANIZATION_IDS.ticketmaster },
  { hostname: 'tracking.groupon.com', organization_id: ORGANIZATION_IDS.groupon },
  { hostname: 'trycaviar.com', organization_id: ORGANIZATION_IDS.caviar },
  { hostname: 'uber.com', organization_id: ORGANIZATION_IDS.uber },
  { hostname: 'uk.hotels.com', organization_id: ORGANIZATION_IDS.hotelsdotcom },
  { hostname: 'ulta.com', organization_id: ORGANIZATION_IDS.ulta },
  { hostname: 'underarmour.com', organization_id: ORGANIZATION_IDS.underarmour },
  { hostname: 'vitacost.com', organization_id: ORGANIZATION_IDS.vitacost },
  { hostname: 'vrbo.com', organization_id: ORGANIZATION_IDS.vrbo },
  { hostname: 'walgreens.com', organization_id: ORGANIZATION_IDS.walgreens },
  { hostname: 'walmart.com', organization_id: ORGANIZATION_IDS.walmart },
  { hostname: 'warbyparker.com', organization_id: ORGANIZATION_IDS.warbyparker },
  { hostname: 'wine.com', organization_id: ORGANIZATION_IDS.winedotcom },
  { hostname: 'worldmarket.com', organization_id: ORGANIZATION_IDS.costplusworldmarket },
  { hostname: 'yoox.com', organization_id: ORGANIZATION_IDS.yoox },
  { hostname: 'zaful.com', organization_id: ORGANIZATION_IDS.zaful },
  { hostname: 'zulily.com', organization_id: ORGANIZATION_IDS.zulily },
  { hostname: 'buttontestmerchant.com', organization_id: ORGANIZATION_IDS.testmerchant },
];

/**
 * Supported Affiliate Query Ids are the global list of supported affililiate
 * identifiers of Button merchants in an affiliate link's query.  For instance,
 * an affiliate link may look like:
 *
 * https://click.linksynergy.com?id=1234
 *
 * If we know "id" maps to a target merchant and in our space a value of "1234"
 * maps to "org-XXX", we'd declaring the following Supported Affiliate Query Id:
 *
 * {
 *   hostname: 'click.linksynergy.com',
 *   key: 'id',
 *   value: '1234',
 *   organization_id: 'org-XXX',
 *   url: 'http://bloop.net.co.uk'
 * }
 *
 * Supported Affiliate Query Ids have the following schema:
 *
 * hostname [string]: The hostname, including subdomains of the affiliate
 * key [string]: The query param key
 * value [string]: The query param value
 * organization_id [string]: The Button merchant organization id.
 * url [string]: The url to use as a destination on match.
 */
const SUPPORTED_AFFILIATE_QUERY_IDS = [];

/**
 * Supported Affiliate Pathname Ids are the global list of supported affiliate
 * identifiers of Button merchants in an affiliate link's pathname.  For
 * instance, an affiliate link may look like:
 *
 * https://quidco.com/visit/US/123
 *
 * If we know in the "US" namespace, id "123" maps to "org-XXX", we'd declare
 * the following Supported Affiliate Pathname Id:
 *
 * {
 *   hostname: 'quidco.com',
 *   regex: String.raw`\/visit\/(\w{2,})\/\(d{1,})`,
 *   matches: [
 *     { values: ['US', '123'], organization_id: 'org-XXX' }
 *   ]
 * }
 *
 * To be returned in an SDK config, the affiliate hostname must also be declared
 * in `SUPPORTED_AFFILIATES`.
 *
 * Supported Affiliate Pathname Ids have the following schema:
 *
 * hostname [string]: The hostname, including subdomains of the affiliate
 * regex [string]: The regex to match a pathname against
 * redirect [boolean]: Whether or not a match indicates the need to follow a
 *   redirect.
 * cacheKey [?function]: A function that accepts a matching url and returns an
 *   appropriate hash identifying the uniqueness of the redirect.
 * matches [array<object>]: The match candidates
 * matches[i].values [array<string>]: The match candidate values
 * matches[i].organization_id [string]: The match candidate organization id
 * matches[i].url [string]: The match candidate target url.  As if this was the
 *   eventual redirect location of the link.
 */
const SUPPORTED_AFFILIATE_PATHNAME_IDS = [
  {
    hostname: 'quidco.com',
    regex: String.raw`(?:^|\/)(?:\w{1,}-)?visit\/(\d{1,})(?:$|\/.*)`,
    redirect: false,
    matches: [
      {
        values: ['6078'],
        organization_id: ORGANIZATION_IDS.groupon,
        url: 'https://www.groupon.co.uk',
      },
      {
        values: ['244'],
        organization_id: ORGANIZATION_IDS.hotelsdotcom,
        url: 'https://www.hotels.com',
      },
      {
        values: ['4439'],
        organization_id: ORGANIZATION_IDS.hungryhouse,
        url: 'https://www.hungryhouse.co.uk',
      },
      {
        values: ['3453'],
        organization_id: ORGANIZATION_IDS.mrandmrssmith,
        url: 'https://www.mrandmrssmith.com',
      },
      {
        values: ['13817'],
        organization_id: ORGANIZATION_IDS.hoteltonight,
        url: 'https://hoteltonight.com',
      },
      {
        values: ['9639'],
        organization_id: ORGANIZATION_IDS.bloomandwild,
        url: 'https://bloomandwild.com',
      },
      {
        values: ['14696'],
        organization_id: ORGANIZATION_IDS.uberrewards,
        url: 'https://get.uber.com',
      },
      {
        values: ['13819'],
        organization_id: ORGANIZATION_IDS.uberrewards,
        url: 'https://get.uber.com',
      },
      {
        values: ['12366'],
        organization_id: ORGANIZATION_IDS.ebay,
        url: 'https://ebay.co.uk',
      },
      {
        values: ['14840'],
        organization_id: ORGANIZATION_IDS.asos,
        url: 'https://asos.com',
      },
      {
        values: ['169'],
        organization_id: ORGANIZATION_IDS.asos,
        url: 'https://asos.com',
      },
    ],
  },
  {
    hostname: 'vouchercloud.com',
    regex: String.raw`(?:^|\/)(\w{1,})\/(\w{1,})\/\d{1,}(?:$|\/.*)`,
    redirect: true,
    cacheKey: null,
    matches: [
      {
        values: ['out', 'offer'],
        organization_id: null,
        url: null,
      },
    ],
  },
  {
    hostname: 'groupon.com',
    regex: String.raw`(?:^|\/)(\w{1,})\/(\w{1,})\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:$|\/.*)`,
    redirect: true,
    cacheKey: null,
    matches: [
      {
        values: ['coupons', 'click'],
        organization_id: null,
        url: null,
      },
    ],
  },
];

/**
 * Supported Affiliates are the global list of affiliates supported for link
 * enhancement.  For instance, an affiliate link may look like:
 *
 * https://click.linksynergy.com?url=https%3A%2F%2Fbloop.com
 *
 * where the affiliate link points at a destination url.  We'd support such a
 * link by declaring the following Supported Affiliate:
 *
 * {
 *   hostname: 'click.linksynergy.com',
 *   display_name: 'Rakuten Linkshare',
 *   query_url_keys: [{ key: 'murl' }]
 * }
 *
 * Supported Affiliates have the following schema:
 *
 * hostname [string]: The hostname of the affiliate
 * display_name [string]: A human-readable name for the affiliate partner
 * query_url_keys [Array<object<string, string>>]: An array of objects where the
 *   "key" element is a string representing the key of the url in the
 *   affiliate's query string.
 */
const SUPPORTED_AFFILIATES = [
  {
    hostname: 'click.linksynergy.com',
    display_name: 'Rakuten Linkshare',
    query_url_keys: [{ key: 'murl' }, { key: 'url' }],
  },
  {
    hostname: 'quidco.com',
    display_name: 'Quidco',
    query_url_keys: [],
  },
  {
    hostname: 'vouchercloud.com',
    display_name: 'Vouchercloud',
    query_url_keys: [],
  },
  {
    hostname: 'groupon.com',
    display_name: 'Groupon',
    query_url_keys: [],
  },
];

module.exports = {
  ORGANIZATION_IDS,
  SUPPORTED_MERCHANTS,
  SUPPORTED_AFFILIATE_QUERY_IDS,
  SUPPORTED_AFFILIATE_PATHNAME_IDS,
  SUPPORTED_AFFILIATES,
};
