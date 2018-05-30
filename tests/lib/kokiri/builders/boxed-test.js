const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const BOXED_ORG_ID = 'org-372a59a7b6ddb53b';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';

describe('lib/kokiri/builders/boxed', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: BOXED_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: BOXED_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: BOXED_ORG_ID,
        default_value: 'button',
        name: 'utmcampaign',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: SHOPKICK_ORG_ID,
        value: 'shopkick',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', BOXED_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'boxedwholesale://boxed.com?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.boxed.com?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              utm_source: 'pavel',
              utm_medium: 'pavel',
              utm_campaign: 'pavel',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'boxedwholesale://boxed.com?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.boxed.com?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(SHOPKICK_ORG_ID, BOXED_ORG_ID);
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'boxedwholesale://boxed.com?utm_source=button&utm_medium=affiliate&utm_campaign=shopkick&btn_ref=srctok-XXX',
        browser_link:
          'https://www.boxed.com?utm_source=button&utm_medium=affiliate&utm_campaign=shopkick&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for product', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/product/129/special-k-red-berries-cereal-37-oz.-2-bags/',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'boxedwholesale://boxed.com/product/129/special-k-red-berries-cereal-37-oz.-2-bags?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.boxed.com/product/129/special-k-red-berries-cereal-37-oz.-2-bags?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a null app link for webview only paths', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/products/highlight/67/prince-spring',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.boxed.com/products/highlight/67/prince-spring?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for category', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/products/category/137/lifestyle/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'boxedwholesale://boxed.com/products/category/137/lifestyle?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.boxed.com/products/category/137/lifestyle?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://boxed.bttn.io?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.boxed.com?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
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
            'https://boxed.bttn.io/bloop?a=2&utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.boxed.com/bloop?a=2&utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(SHOPKICK_ORG_ID, BOXED_ORG_ID);
      assert.deepEqual(builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://boxed.bttn.io?utm_source=button&utm_medium=affiliate&utm_campaign=shopkick&btn_ref=srctok-XXX',
        browser_link:
          'https://www.boxed.com?utm_source=button&utm_medium=affiliate&utm_campaign=shopkick&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action protecting affiliation parameters', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            query: {
              utm_source: 'pavel',
              utm_medium: 'pavel',
              utm_campaign: 'pavel',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://boxed.bttn.io?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.boxed.com?utm_source=button&utm_medium=affiliate&utm_campaign=button&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.boxed.com/products/category/137/lifestyle/?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/products/category/137/lifestyle/',
        query: { utm_campaign: 'BEST OIL' },
        hash: null,
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      pathname: null,
      query: {},
      hash: null,
    });
  });
});
