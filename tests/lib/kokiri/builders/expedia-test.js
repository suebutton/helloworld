const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const EXPEDIA_ORG_ID = 'org-404d3602c71bd428';
const SAMSUNG_ORG_ID = 'org-4738195f8e741d19';
const TOPCASHBACKUK_ORG_ID = 'org-17b32d35f3aced3e';

describe('lib/kokiri/builders/expedia', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: EXPEDIA_ORG_ID,
      },
      {
        status: 'approved',
        audience: SAMSUNG_ORG_ID,
        organization: EXPEDIA_ORG_ID,
      },
      {
        status: 'approved',
        audience: TOPCASHBACKUK_ORG_ID,
        organization: EXPEDIA_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: EXPEDIA_ORG_ID,
        default_value: 'US.NETWORK.BUTTON.300843',
        name: 'affcid',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: SAMSUNG_ORG_ID,
        value: 'US.NETWORK.BUTTON.123456',
      },
      {
        partner_parameter: '12345',
        organization: TOPCASHBACKUK_ORG_ID,
        value: 'UK.NETWORK.BUTTON.123456',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', EXPEDIA_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action for .com link', function() {
      assert.deepEqual(
        this.builder.appAction(
          { hostname: 'expedia.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.com/mobile/deeplink?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.com?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for .co.uk link', function() {
      assert.deepEqual(
        this.builder.appAction(
          { hostname: 'expedia.co.uk' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.co.uk/mobile/deeplink?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.co.uk?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for .co.uk links', function() {
      const builder = this.config.createBuilder('org-XXX', EXPEDIA_ORG_ID);
      assert.deepEqual(
        builder.appAction(
          builder.getDestinationFromUrl('https://expedia.co.uk'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.co.uk/mobile/deeplink?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.co.uk?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for www. link', function() {
      assert.deepEqual(
        this.builder.appAction(
          { hostname: 'www.expedia.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.com/mobile/deeplink?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.com?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with flight destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/Flights',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.com/mobile/deeplink/Flights-search?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.com/Flights?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with hotel destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/Hotels',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.com/mobile/deeplink/Hotel-search?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.com/Hotels?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with US car destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'expedia.com',
            pathname: '/Cars',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.com/mobile/deeplink/carsearch?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.com/Cars?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with UK car destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'expedia.co.uk',
            pathname: '/car-hire',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.co.uk/mobile/deeplink/carsearch?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.co.uk/car-hire?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with activites destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/Activities',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.com/mobile/deeplink/things-to-do?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.com/Activities?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with non-supported destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/Snowmobiles',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.expedia.com/Snowmobiles?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for Samsung', function() {
      const builder = this.config.createBuilder(SAMSUNG_ORG_ID, EXPEDIA_ORG_ID);

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://www.expedia.com/mobile/deeplink?AFFCID=US.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.expedia.com?AFFCID=US.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for TopCashback', function() {
      const builder = this.config.createBuilder(
        TOPCASHBACKUK_ORG_ID,
        EXPEDIA_ORG_ID
      );

      assert.deepEqual(
        builder.appAction({ hostname: 'expedia.co.uk' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'https://www.expedia.co.uk/mobile/deeplink?AFFCID=UK.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.co.uk?AFFCID=UK.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.expedia.com?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action with flights destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/Flights',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.expedia.com/Flights?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with random destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.expedia.com/bloop?a=2&AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with protected affiliation parameters', function() {
      const query = {
        AFFCID: 'pavel',
        AFFLID: 'pavel',
      };

      assert.deepEqual(this.builder.webAction({ query }, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.expedia.com?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns a destination from a US url', function() {
      assert.deepEqual(
        this.builder.destinationFromUrl(
          'https://www.expedia.com/hotels/us/tuscan-inn.html?utm_campaign=BEST%20OIL'
        ),
        {
          hostname: 'www.expedia.com',
          pathname: '/hotels/us/tuscan-inn.html',
          query: { utm_campaign: 'BEST OIL' },
          hash: null,
        }
      );
    });

    it('returns a destination from a UK url', function() {
      assert.deepEqual(
        this.builder.destinationFromUrl(
          'https://www.expedia.co.uk/hotels/us/tuscan-inn.html?utm_campaign=BEST%20OIL'
        ),
        {
          hostname: 'www.expedia.co.uk',
          pathname: '/hotels/us/tuscan-inn.html',
          query: { utm_campaign: 'BEST OIL' },
          hash: null,
        }
      );
    });

    it('returns a destination from a blank url', function() {
      assert.deepEqual(this.builder.destinationFromUrl(''), {
        hostname: null,
        pathname: null,
        query: {},
        hash: null,
      });
    });
  });
});
