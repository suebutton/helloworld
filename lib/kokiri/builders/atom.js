const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchPathname, matchHomepage } = require('../app-mapping');

class Atom extends LinkBuilder {
  getAppLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatUrl({
      protocol: 'atom',
      hostname: '',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'www.atomtickets.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  getButtonUniversalLink(appDestination) {
    return formatButtonUniversalUrl('atomtickets', appDestination);
  }
}

Atom.AppMappings = [
  {
    match: matchPathname('/movies/:slug/:id([0-9]+)/(.*)?'),
    destination: {
      pathname: '/ViewProductionDetails',
      query: (match, prevQuery) => ({
        ...prevQuery,
        ...{ productionId: match.id },
      }),
    },
  },
  {
    match: matchHomepage,
  },
];

module.exports = Atom;
