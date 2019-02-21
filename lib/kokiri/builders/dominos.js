const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchHomepage } = require('../app-mapping');

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
    const { query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.dominos.com',
      pathname: '/en',
      query,
      hash,
      slashes: true,
    });
  }
}

Dominos.AppMappings = [
  {
    match: matchHomepage,
    destination: {
      pathname: 'open',
    },
  },
];

module.exports = Dominos;
