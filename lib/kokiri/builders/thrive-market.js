const { merge, extend } = require('lodash');
const { formatUrl, formatButtonUniversalUrl } = require('../lib');
const { matchHomepage, matchPathname } = require('../app-mapping');

const LinkBuilder = require('./link-builder');

/**
 * Thrive Market
 *
 * Supports the following destination object:
 *
 * {
 *   pathname,
 *   query,
 *   hash
 * }
 *
 */
class ThriveMarket extends LinkBuilder {
  query(...extraQueryParams) {
    return merge({}, ...extraQueryParams, {
      utm_source: this.publisherId,
      utm_campaign: 'button',
    });
  }

  appQuery(extraQueryParams) {
    return this.query(
      { ReferrerURL: ThriveMarket.ReferrerUrl },
      extraQueryParams
    );
  }

  getAppLink(appDestination) {
    const { hostname, query } = appDestination;

    return formatUrl({
      protocol: 'thrivemarket',
      hostname,
      query: this.appQuery(query),
      slashes: true,
    });
  }

  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    const browserQuery = this.query(query, {
      utm_medium: 'affiliate',
      utm_content: 'default',
      utm_term: 'na',
    });

    return formatUrl({
      protocol: 'https',
      hostname: 'thrivemarket.com',
      pathname,
      query: browserQuery,
      hash,
    });
  }

  getButtonUniversalLink(appDestination) {
    const { pathname, query, hash } = appDestination;

    return formatButtonUniversalUrl('thrivemarket', {
      pathname,
      query: extend({}, query, this.appQuery()),
      hash,
    });
  }
}

ThriveMarket.ReferrerUrl =
  'aHR0cHM6Ly90aHJpdmVtYXJrZXQuY29tLz91dG1fbWVkaXVtPWFmZmlsaWF0ZSZ1dG1fc291cmNlPWJ1dHRvbiZ1dG1fY2FtcGFpZ249aWJvdHRhJnV0bV9jb250ZW50PWRlZmF1bHQmdXRtX3Rlcm09bmE%3D';

ThriveMarket.AppMappings = [
  {
    match: matchHomepage,
    destination: { hostname: 'home' },
  },
  {
    match: matchPathname('/catalogsearch/result'),
    destination: {
      hostname: 'search',
      query: (match, prevQuery) => ({ search_text: prevQuery.q }),
    },
  },
];

module.exports = ThriveMarket;
