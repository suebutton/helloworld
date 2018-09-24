const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const TRAVELOCITY_ORG_ID = 'org-09b845f7f5293f1a';
const SAMSUNG_ORG_ID = 'org-4738195f8e741d19';

describe('lib/kokiri/builders/travelocity', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: TRAVELOCITY_ORG_ID,
      },
      {
        status: 'approved',
        audience: SAMSUNG_ORG_ID,
        organization: TRAVELOCITY_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: TRAVELOCITY_ORG_ID,
        default_value: '300843',
        name: 'affcid',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: SAMSUNG_ORG_ID,
        value: '123456',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', TRAVELOCITY_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action for .com link', function() {
      assert.deepEqual(
        this.builder.appAction(
          { hostname: 'www.travelocity.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.travelocity.com/mobile/deeplink?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.com?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for .ca link', function() {
      assert.deepEqual(
        this.builder.appAction(
          { hostname: 'www.travelocity.ca' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.travelocity.ca/mobile/deeplink?AFFCID=TRAVELOCITY-CA.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.ca?AFFCID=TRAVELOCITY-CA.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for .com links', function() {
      const builder = this.config.createBuilder('org-XXX', TRAVELOCITY_ORG_ID);
      assert.deepEqual(
        builder.appAction(
          builder.getDestinationFromUrl('https://travelocity.com'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.travelocity.com/mobile/deeplink?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.com?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for .ca links', function() {
      const builder = this.config.createBuilder('org-XXX', TRAVELOCITY_ORG_ID);
      assert.deepEqual(
        builder.appAction(
          builder.getDestinationFromUrl('https://travelocity.ca'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.travelocity.ca/mobile/deeplink?AFFCID=TRAVELOCITY-CA.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.ca?AFFCID=TRAVELOCITY-CA.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for www. link', function() {
      assert.deepEqual(
        this.builder.appAction(
          { hostname: 'www.travelocity.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.travelocity.com/mobile/deeplink?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.com?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with "Flights" destination', function() {
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
            'https://www.travelocity.com/mobile/deeplink/Flights-search?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.com/Flights?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with "flights" destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/flights',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.travelocity.com/mobile/deeplink/Flights-search?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.com/flights?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
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
            'https://www.travelocity.com/mobile/deeplink/Hotel-search?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.com/Hotels?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with car destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'travelocity.com',
            pathname: '/Cars',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.travelocity.com/mobile/deeplink/carsearch?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.com/Cars?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
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
            'https://www.travelocity.com/mobile/deeplink/things-to-do?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.travelocity.com/Activities?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
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
            'https://www.travelocity.com/Snowmobiles?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for Samsung', function() {
      const builder = this.config.createBuilder(
        SAMSUNG_ORG_ID,
        TRAVELOCITY_ORG_ID
      );

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://www.travelocity.com/mobile/deeplink?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.travelocity.com?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.travelocity.com?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
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
            'https://www.travelocity.com/Flights?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
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
            'https://www.travelocity.com/bloop?a=2&AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
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
          'https://www.travelocity.com?AFFCID=TRAVELOCITY-US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns a destination from a US url', function() {
      assert.deepEqual(
        this.builder.destinationFromUrl(
          'https://www.travelocity.com/hotels/us/tuscan-inn.html?utm_campaign=BEST%20OIL'
        ),
        {
          hostname: 'www.travelocity.com',
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
