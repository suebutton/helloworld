const {
  formatUrl,
  formatButtonUniversalUrl,
  cleanPathname,
} = require('../lib');

const LinkBuilder = require('./link-builder');

class Uber extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'uber',
      hostname: cleanPathname(pathname),
      pathname: '',
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('uberm', appDestination);
  }
}

Uber.AppMappings = [{ match: true }];

module.exports = Uber;
