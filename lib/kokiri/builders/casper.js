const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

class Casper extends LinkBuilder {
  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.casper.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }
}

module.exports = Casper;
