const { formatUrl } = require('../lib');

const LinkBuilder = require('./link-builder');

// The MileagePlus X app only supports routing to homepage.
// There is no mWebsite for MPX.
class MileagePlusX extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol: 'mileageplusx',
      slashes: true,
    });
  }
}

module.exports = MileagePlusX;
