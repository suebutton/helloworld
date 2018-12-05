const { get } = require('lodash');
const { formatUrl, normalizeHostname } = require('../lib');
const LinkBuilder = require('./link-builder');

// In order to expand our support for possible incoming merchant URLs,
// we maintain a hostname map like below to normalize the URLs correctly.

const HOSTNAME_MAP = {
  'lookfantastic.com': 'us.lookfantastic.com',
  'hp.com': 'store.hp.com',
};

class Awin extends LinkBuilder {
  awinMerchantId() {
    return Awin.MerchantID[this.merchantId] || null;
  }

  awinPublisherId() {
    return Awin.PublisherID[this.publisherId] || null;
  }

  hostname(destination) {
    const { hostname } = destination;

    return get(HOSTNAME_MAP, normalizeHostname(hostname), hostname);
  }

  url(destination) {
    const { pathname, query } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: this.hostname(destination),
      pathname,
      query,
      slashes: true,
    });
  }

  query(destination, attributionToken) {
    const awinmid = this.awinMerchantId();
    const awinaffid = this.awinPublisherId();

    return {
      btn_tkn: attributionToken,
      clickref: attributionToken,
      awinmid,
      awinaffid,
      p: this.url(destination),
    };
  }

  getBrowserLink(destination, attributionToken) {
    const awinmid = this.awinMerchantId();
    const awinaffid = this.awinPublisherId();

    if (awinmid === null) {
      return null;
    }

    if (awinaffid === null) {
      return null;
    }

    return formatUrl({
      protocol: 'https',
      hostname: 'www.awin1.com',
      pathname: 'cread.php',
      query: this.query(destination, attributionToken),
      slashes: true,
    });
  }
}

Awin.HasButtonWebAffiliation = false;

Awin.MerchantID = {
  'org-25740638c0bcbc4b': '11583', // Glossybox staging
  'org-7789fce2df3c5f7a': '11583', // Glossybox prod
  'org-306d5b9fb5eb256a': '10908', // Gymshark staging
  'org-79ca35cb8ff4c50f': '10908', // Gymshark prod
  'org-6bd3d6a70b2043a5': '7168', // HP staging
  'org-41f6254ceb763673': '7168', // HP prod
  'org-18731bdd4a79263e': '7745', // Loews Hotels & Resorts staging
  'org-2b91eb357bbf2fce': '7745', // Loews Hotels & Resorts prod
  'org-43d3b3af2c665845': '6038', // Lookfantastic staging
  'org-531e10d4cca3105c': '6038', // Lookfantastic prod
  'org-52755d07d1200794': '15340', // Skinstore staging
  'org-4936584820669a2b': '15340', // Skinstore prod
  'org-149f1835453e9b25': '4413', // Superdry staging
  'org-2a4d3c8e08e42270': '4413', // Superdry prod
  'org-1b6dd43d7491fcca': '15258', // Ted Baker staging
  'org-7188b485cac95d0f': '15258', // Ted Baker prod
  'org-7aae97fa03a97e54': '11018', // Viator staging
  'org-3c5a6f0c3f0b02bc': '11018', // Viator prod
};

// To start, we are using the same Pub ID below for Ibotta and Button Demo.
// In time, we will add more publishers and thus this sets us up for the future.

Awin.PublisherID = {
  'org-3eec44df0966f6f0': '535157', // Button Demo prod
  'org-63cd58a1a2a8b543': '535157', // Button Demo staging
  'org-2d432a88b9bb8bda': '535157', // Ibotta
};

module.exports = Awin;
