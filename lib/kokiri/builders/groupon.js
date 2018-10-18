const { get, omit, invert } = require('lodash');

const {
  parseUrl,
  normalizeHostname,
  formatUrl,
  joinPathname,
} = require('../lib');

const LinkBuilder = require('./link-builder');

const {
  matchPathname,
  matchQuery,
  matchHomepage,
  composeMatches,
} = require('../app-mapping');

const UTM_CAMPAIGN_NAME = 'utm-campaign';
const UTM_CAMPAIGN_FALLBACK = '204629';
const WID_NAME = 'wid';
const WID_FALLBACK = null;

// Groupon guided us on acceptable GPN domains on 4/24/18
const HOSTNAME_TO_REGION_MAP = {
  'groupon.ae': 'AE',
  'groupon.com.au': 'AU',
  'groupon.be': 'BE',
  'groupon.de': 'DE',
  'groupon.es': 'ES',
  'groupon.fr': 'FR',
  'groupon.ie': 'IE',
  'groupon.it': 'IT',
  'groupon.nl': 'NL',
  'grouponnz.co.nz': 'NZ',
  'groupon.pl': 'PL',
  'groupon.co.uk': 'UK',
  'groupon.com': 'US',
};

// Groupon guided us to map GPN domain to media ID on 4/24/18
const HOSTNAME_TO_MEDIA_ID_MAP = {
  'groupon.com': '500',
  'groupon.ae': '501',
  'groupon.be': '504',
  'groupon.de': '508',
  'groupon.es': '510',
  'groupon.fr': '512',
  'groupon.ie': '514',
  'groupon.it': '517',
  'groupon.nl': '519',
  'grouponnz.co.nz': '521',
  'groupon.pl': '524',
  'groupon.co.uk': '531',
  'groupon.com.au': '533',
};

const HOSTNAME_TO_TRACKING_HOSTNAME_MAP = {
  'groupon.ae': 't.groupon.ae',
  'groupon.com.au': 't.groupon.com.au',
  'groupon.be': 't.groupon.be',
  'groupon.de': 't.groupon.de',
  'groupon.es': 't.groupon.es',
  'groupon.fr': 't.groupon.fr',
  'groupon.ie': 't.groupon.ie',
  'groupon.it': 't.groupon.it',
  'groupon.nl': 't.groupon.nl',
  'grouponnz.co.nz': 't.grouponnz.co.nz',
  'groupon.pl': 't.groupon.pl',
  'groupon.co.uk': 't.groupon.co.uk',
  'groupon.com': 'tracking.groupon.com',
};

class Groupon extends LinkBuilder {
  hostname(destination) {
    const normalizedHostname = normalizeHostname(destination.hostname);

    if (normalizedHostname in HOSTNAME_TO_REGION_MAP) {
      return normalizedHostname;
    }

    return 'groupon.com';
  }

  region(destination) {
    const hostname = this.hostname(destination);
    return HOSTNAME_TO_REGION_MAP[hostname] || 'US';
  }

  utmCampaign() {
    return this.getPartnerValue(UTM_CAMPAIGN_NAME, UTM_CAMPAIGN_FALLBACK);
  }

  mediaId(destination) {
    const hostname = this.hostname(destination);
    return HOSTNAME_TO_MEDIA_ID_MAP[hostname] || '500';
  }

  tsToken(destination) {
    return [
      this.region(destination),
      'AFF',
      '0',
      this.utmCampaign(),
      this.mediaId(destination),
      '0',
    ].join('_');
  }

  wid() {
    return this.getPartnerValue(WID_NAME, WID_FALLBACK);
  }

  trackingHostname(destination) {
    const hostname = this.hostname(destination);

    return get(
      HOSTNAME_TO_TRACKING_HOSTNAME_MAP,
      hostname,
      'tracking.groupon.com'
    );
  }

  redirectUrl(destination) {
    const { pathname, query, hash } = destination;

    return formatUrl({
      protocol: 'https',
      hostname: `www.${this.hostname(destination)}`,
      pathname,
      query: omit(query, [
        'utm_medium',
        'utm_source',
        'utm_campaign',
        'mediaId',
        'sid',
        'wid',
      ]),
      hash,
      slashes: true,
    });
  }

  appQuery(destination, attributionToken) {
    const { query } = destination;

    return {
      ...query,
      ...{
        utm_medium: 'afl',
        utm_source: 'GPN',
        utm_campaign: this.utmCampaign(),
        mediaId: this.mediaId(destination),
        sid: attributionToken,
        wid: this.wid(),
      },
    };
  }

  linkQuery(destination, attributionToken) {
    return {
      tsToken: this.tsToken(destination),
      sid: attributionToken,
      url: this.redirectUrl(destination),
      wid: this.wid(),
    };
  }

  getAppLink(appDestination, platform, attributionToken) {
    const { pathname, hash } = appDestination;

    return formatUrl({
      protocol: 'groupon',
      hostname: null,
      pathname: joinPathname([
        'dispatch',
        this.region(appDestination).toLowerCase(),
        pathname,
      ]),
      query: this.appQuery(appDestination, attributionToken),
      hash,
      slashes: true,
    });
  }

  getBrowserLink(destination, attributionToken) {
    return formatUrl({
      protocol: 'https',
      hostname: this.trackingHostname(destination),
      pathname: '/r',
      query: this.linkQuery(destination, attributionToken),
      slashes: true,
    });
  }

  getDestinationFromUrl(url) {
    const { hostname, query } = parseUrl(url);

    if (normalizeHostname(hostname) in Groupon.trackingHostnameToHostnameMap) {
      return super.getDestinationFromUrl(
        get(query, 'url', 'https://groupon.com')
      );
    }

    return super.getDestinationFromUrl(url);
  }
}

Groupon.AppMappings = [
  {
    match: matchPathname('/deal(s)?/:id'),
    destination: {
      pathname: match => joinPathname(['deal', match.id]),
    },
  },
  {
    match: composeMatches(
      matchQuery({ category: /.*/ }),
      matchPathname('/browse/(.*)?')
    ),
    destination: { pathname: 'search' },
  },
  {
    match: matchPathname('/:channel(getaways|goods)'),
    destination: {
      pathname: match => joinPathname(['channel', match.channel]),
    },
  },
  {
    match: matchHomepage,
  },
];

Groupon.trackingHostnameToHostnameMap = invert(
  HOSTNAME_TO_TRACKING_HOSTNAME_MAP
);

module.exports = Groupon;
