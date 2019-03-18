const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const ETSY_ORG_ID = 'org-3ee55c6f49b96819';
const ACORNS_ORG_ID = 'org-0ae7f03a3ad7f664';
const AWIN_ORG_ID = 'org-11f5e62b4ebe0005';

describe('lib/kokiri/builders/etsy', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: ETSY_ORG_ID,
      },
      {
        status: 'approved',
        audience: ACORNS_ORG_ID,
        organization: ETSY_ORG_ID,
      },
      {
        status: 'approved',
        audience: AWIN_ORG_ID,
        organization: ETSY_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: ETSY_ORG_ID,
        default_value: 'us_location_buyer',
        name: 'utmcampaign',
      },
      {
        id: '54321',
        organization: ETSY_ORG_ID,
        default_value: 'button',
        name: 'utmcontent',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: ACORNS_ORG_ID,
        value: 'us_location_buyer',
      },
      {
        partner_parameter: '54321',
        organization: ACORNS_ORG_ID,
        value: 'acorns',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', ETSY_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'etsy://?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.etsy.com?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
      });

      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'etsy://home?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.etsy.com?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              utm_medium: 'pavel',
              utm_source: 'pavel',
              utm_campaign: 'pavel',
              utm_content: 'pavel',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(ACORNS_ORG_ID, ETSY_ORG_ID);
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'etsy://?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=acorns&btn_ref=srctok-XXX',
        browser_link:
          'https://www.etsy.com?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=acorns&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for featured', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/featured/halloween',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://featured/halloween?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/featured/halloween?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/featured/halloween',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://featured/halloween?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/featured/halloween?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a listing', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/listing/123',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://listing/123?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/listing/123?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/listing/123/slug',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://listing/123/slug?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/listing/123/slug?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/listing/123',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://listing/123?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/listing/123?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for categories', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/c',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://c?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/c?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/c',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.etsy.com/c?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/c/home/bedding/sheets',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://c/home/bedding/sheets?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/c/home/bedding/sheets?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/c/home/bedding/sheets',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.etsy.com/c/home/bedding/sheets?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for etsy.ca', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.etsy.ca',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'http://www.etsy.ca?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for an untested hostname', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.etsy.nz',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('passes through utm_content for select publishers', function() {
      const builder = this.config.createBuilder(AWIN_ORG_ID, ETSY_ORG_ID);

      assert.deepEqual(
        builder.appActionFromUrl(
          'https://www.etsy.com?utm_content=subPub123',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'etsy://?utm_content=subPub123&utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com?utm_content=subPub123&utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        builder.appActionFromUrl('https://www.etsy.com', 'ios', 'srctok-XXX'),
        {
          app_link:
            'etsy://?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://etsy.bttn.io?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.etsy.com?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
      });

      assert.deepEqual(this.builder.webAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'https://etsy.bttn.io?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.etsy.com?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io/bloop?a=2&utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/bloop?a=2&utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination for android', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io/bloop?a=2&utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/bloop?a=2&utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action for etsy.com/uk after stripping it from path for iOS', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/uk',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/uk?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action for etsy.com/uk/... without stripping /uk from path ', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/uk/c',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io/uk/c?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/uk/c?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action for etsy.com/ca after stripping it from path for iOS', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ca',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/ca?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action for etsy.com/ca without stripping /ca from path for Android', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ca',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io/ca?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/ca?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action for etsy.com/ca/path/to/listing without stripping /ca from path ', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ca/listing/9999/tacos',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io/ca/listing/9999/tacos?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com/ca/listing/9999/tacos?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action for etsy.ca', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            hostname: 'www.etsy.ca',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'http://www.etsy.ca?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action for an untested hostname', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            hostname: 'www.etsy.nz',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com?utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&utm_content=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action and passes through utm_content for AWIN', function() {
      const builder = this.config.createBuilder(AWIN_ORG_ID, ETSY_ORG_ID);

      assert.deepEqual(
        builder.webActionFromUrl(
          'https://www.etsy.com?utm_content=subPub123',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://etsy.bttn.io?utm_content=subPub123&utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&btn_ref=srctok-XXX',
          browser_link:
            'https://www.etsy.com?utm_content=subPub123&utm_medium=affiliate&utm_source=button&utm_campaign=us_location_buyer&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
