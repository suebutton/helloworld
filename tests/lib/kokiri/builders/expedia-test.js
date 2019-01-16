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
      {
        partner_parameter: '12345',
        organization: TOPCASHBACKUK_ORG_ID,
        value: '123456',
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
          this.builder.getDestinationFromUrl('https://www.expedia.com'),
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
          this.builder.getDestinationFromUrl('https://www.expedia.co.uk'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.co.uk/mobile/deeplink?AFFCID=UK.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.co.uk?AFFCID=UK.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for .fr link', function() {
      assert.deepEqual(
        this.builder.appAction(
          this.builder.getDestinationFromUrl('https://www.expedia.fr'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.fr/mobile/deeplink?AFFCID=FR.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.fr?AFFCID=FR.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
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
            'https://www.expedia.co.uk/mobile/deeplink?AFFCID=UK.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.co.uk?AFFCID=UK.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for www. link', function() {
      assert.deepEqual(
        this.builder.appAction(
          this.builder.getDestinationFromUrl('https://www.expedia.com'),
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
          this.builder.getDestinationFromUrl('https://www.expedia.com/Flights'),
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
          this.builder.getDestinationFromUrl('https://www.expedia.com/Hotels'),
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
          this.builder.getDestinationFromUrl('https://www.expedia.com/Cars'),
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
          this.builder.getDestinationFromUrl(
            'https://www.expedia.co.uk/car-hire'
          ),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.co.uk/mobile/deeplink/carsearch?AFFCID=UK.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.co.uk/car-hire?AFFCID=UK.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with activites destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          this.builder.getDestinationFromUrl(
            'https://www.expedia.com/Activities'
          ),
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
          this.builder.getDestinationFromUrl(
            'https://www.expedia.com/Snowmobiles'
          ),
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

      assert.deepEqual(
        builder.appAction(
          this.builder.getDestinationFromUrl('https://www.expedia.com'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.com/mobile/deeplink?AFFCID=US.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.com?AFFCID=US.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for TopCashback', function() {
      const builder = this.config.createBuilder(
        TOPCASHBACKUK_ORG_ID,
        EXPEDIA_ORG_ID
      );

      assert.deepEqual(
        builder.appAction(
          this.builder.getDestinationFromUrl('https://www.expedia.co.uk'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.co.uk/mobile/deeplink?AFFCID=UK.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.co.uk?AFFCID=UK.NETWORK.BUTTON.123456&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with for Hotel-Search', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.expedia.com.sg/Hotel-Search?destination=Cambodia&startDate=06/02/2019&endDate=07/02/2019&adults=1&regionId=29&sort=price',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.com.sg/mobile/deeplink/Hotel-Search?destination=Cambodia&startDate=06%2F02%2F2019&endDate=07%2F02%2F2019&adults=1&regionId=29&sort=price&AFFCID=SG.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.com.sg/Hotel-Search?destination=Cambodia&startDate=06%2F02%2F2019&endDate=07%2F02%2F2019&adults=1&regionId=29&sort=price&AFFCID=SG.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a specific Hotel', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.expedia.com/Bodrum-Hotels-Ena-Boutique-Hotel.h3832311.Hotel-Information',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://www.expedia.com/mobile/deeplink/Bodrum-Hotels-Ena-Boutique-Hotel.h3832311.Hotel-Information?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.expedia.com/Bodrum-Hotels-Ena-Boutique-Hotel.h3832311.Hotel-Information?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webAction(
          this.builder.getDestinationFromUrl('https://www.expedia.com'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.expedia.com?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with flights destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          this.builder.getDestinationFromUrl('https://www.expedia.com/Flights'),
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
          this.builder.getDestinationFromUrl(
            'https://www.expedia.com/bloop?a=2'
          ),
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
      assert.deepEqual(
        this.builder.webAction(
          this.builder.getDestinationFromUrl(
            'https://www.expedia.com/?AFFCID=pavel&AFFLID=pavel'
          ),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.expedia.com?AFFCID=US.NETWORK.BUTTON.300843&AFFLID=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
