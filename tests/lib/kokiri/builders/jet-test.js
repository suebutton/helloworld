const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const JET_ORG_ID = 'org-7edde2ff2a553edd';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';

describe('lib/kokiri/builders/jet', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: JET_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: JET_ORG_ID,
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', JET_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'jet://home?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.jet.com?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
      });

      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'jet://open?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.jet.com?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action overriding AppsFlyer parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              pid: 'pavel',
              c: 'pavel',
              is_retargeting: 'pavel',
              af_siteid: 'pavel',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://home?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(SHOPKICK_ORG_ID, JET_ORG_ID);
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'jet://home?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-030575eddb72b4df&btn_ref=srctok-XXX',
        browser_link:
          'https://www.jet.com?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-030575eddb72b4df&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/product/0147dccdb5984ec5bbbcaa2cce33022e',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://jet.com/product/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/product/0147dccdb5984ec5bbbcaa2cce33022e',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://jet.com/product/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with destination from extended path', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/product/Shout-Color-Catcher-Dye-Trapping-Sheet-72-Loads/0147dccdb5984ec5bbbcaa2cce33022e',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://jet.com/product/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/Shout-Color-Catcher-Dye-Trapping-Sheet-72-Loads/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/product/Shout-Color-Catcher-Dye-Trapping-Sheet-72-Loads/0147dccdb5984ec5bbbcaa2cce33022e',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://product/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/Shout-Color-Catcher-Dye-Trapping-Sheet-72-Loads/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for promotions', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/promotions/',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.jet.com/promotions?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with default path and query if not matched', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/search/',
            query: { term: 'adidas' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://jet.com/search?term=adidas&pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/search?term=adidas&pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/search/',
            query: { term: 'adidas' },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://search?term=adidas&pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/search?term=adidas&pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/product/0147dccdb5984ec5bbbcaa2cce33022e',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://jet.com/product/product/0147dccdb5984ec5bbbcaa2cce33022e?utm_campaign=BEST%20OIL&pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/0147dccdb5984ec5bbbcaa2cce33022e?utm_campaign=BEST%20OIL&pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for uniquelyj', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/shop/uniquelyj/',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://shop/uniquelyj?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/shop/uniquelyj?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/shop/uniquelyj/',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://shop/uniquelyj?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/shop/uniquelyj?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for backtoschool', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/shop/backtoschool/',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://shop/backtoschool?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/shop/backtoschool?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/shop/backtoschool/',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'jet://shop/backtoschool?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/shop/backtoschool?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://jet.bttn.io/home?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.jet.com?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action overriding AppsFlyer parameters', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            query: {
              pid: 'pavel',
              c: 'pavel',
              is_retargeting: 'pavel',
              af_siteid: 'pavel',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://jet.bttn.io/home?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(SHOPKICK_ORG_ID, JET_ORG_ID);
      assert.deepEqual(builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://jet.bttn.io/home?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-030575eddb72b4df&btn_ref=srctok-XXX',
        browser_link:
          'https://www.jet.com?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-030575eddb72b4df&btn_ref=srctok-XXX',
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
            'https://jet.bttn.io/bloop?a=2&pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/bloop?a=2&pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with adjusted path app link for android homepage', function() {
      assert.deepEqual(this.builder.webAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'https://jet.bttn.io/landing?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.jet.com?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action with destination with null app link for android', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.jet.com/bloop?a=2&pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with adjusted path app link for ios product pages', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname:
              '/product/Shout-Color-Catcher-Dye-Trapping-Sheet-72-Loads/0147dccdb5984ec5bbbcaa2cce33022e',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://jet.bttn.io/product/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/Shout-Color-Catcher-Dye-Trapping-Sheet-72-Loads/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/product/0147dccdb5984ec5bbbcaa2cce33022e',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://jet.bttn.io/product/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/product/product/0147dccdb5984ec5bbbcaa2cce33022e',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://jet.bttn.io/product/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/product/0147dccdb5984ec5bbbcaa2cce33022e?pid=button_int&c=JET_BUTTON&is_retargeting=true&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
