const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');
const { matchAndroid } = require('../app-mapping');

class Postmates extends LinkBuilder {
  query(destination) {
    return {
      ...destination.query,
      pid: 'button_int',
      c: 'button_aff_aff_button_all_all_cpa_all_all',
      is_retargeting: 'TRUE',
      af_siteid: this.publisherId,
    };
  }

  getAppLink(appDestination) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'postmates',
      hostname: pathname,
      pathname: null,
      query: this.query(appDestination),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: 'postmates.com',
      pathname: null,
      query: this.query(destination),
      hash,
      slashes: true,
    });
  }
}

Postmates.AppMappings = [
  {
    match: matchAndroid,
    destination: {
      pathname: 'v1',
    },
  },
  {
    match: true,
    destination: {
      pathname: '',
    },
  },
];

module.exports = Postmates;
