const { formatUrl, formatButtonUniversalUrl, joinPathname } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

// NOTE: Affiliation testing incomplete; in progress as of 01.15.2019.
//

class Dominos extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query } = appDestination;

    return formatUrl({
      protocol: 'dominos',
      hostname: pathname,
      query,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.dominos.com',
      pathname: joinPathname(['en', pathname]),
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('dominos', appDestination);
  }
}

Dominos.AppMappings = [
  {
    match: matchHomepage,
  },
];

module.exports = Dominos;
