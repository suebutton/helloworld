const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const { matchIOS } = require('../app-mapping');

const LinkBuilder = require('./link-builder');

class Bloomthat extends LinkBuilder {
  getAppLink() {
    return formatUrl({
      protocol:
        'amp457f8c357d74d133d500488-98c3a082-af22-11e5-272d-00deb82fd81f',
      hostname: null,
      pathname: null,
      query: null,
      hash: null,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.bloomthat.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('bloomthat', appDestination);
  }
}

Bloomthat.AppMappings = [{ match: matchIOS }];

module.exports = Bloomthat;
