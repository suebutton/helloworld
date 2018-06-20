const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/jet', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-7edde2ff2a553edd',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-7edde2ff2a553edd');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'jet://home?btn_ref=srctok-XXX',
        browser_link: 'https://www.jet.com?btn_ref=srctok-XXX',
      });

      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'jet://open?btn_ref=srctok-XXX',
        browser_link: 'https://www.jet.com?btn_ref=srctok-XXX',
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
            'jet://jet.com/product/product/0147dccdb5984ec5bbbcaa2cce33022e?btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/0147dccdb5984ec5bbbcaa2cce33022e?btn_ref=srctok-XXX',
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
            'jet://jet.com/product/product/0147dccdb5984ec5bbbcaa2cce33022e?btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/0147dccdb5984ec5bbbcaa2cce33022e?btn_ref=srctok-XXX',
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
            'jet://jet.com/product/product/0147dccdb5984ec5bbbcaa2cce33022e?btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/Shout-Color-Catcher-Dye-Trapping-Sheet-72-Loads/0147dccdb5984ec5bbbcaa2cce33022e?btn_ref=srctok-XXX',
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
            'jet://product/product/0147dccdb5984ec5bbbcaa2cce33022e?btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/Shout-Color-Catcher-Dye-Trapping-Sheet-72-Loads/0147dccdb5984ec5bbbcaa2cce33022e?btn_ref=srctok-XXX',
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
          browser_link: 'https://www.jet.com/promotions?btn_ref=srctok-XXX',
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
          app_link: 'jet://jet.com/search?term=adidas&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/search?term=adidas&btn_ref=srctok-XXX',
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
          app_link: 'jet://search?term=adidas&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/search?term=adidas&btn_ref=srctok-XXX',
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
            'jet://jet.com/product/product/0147dccdb5984ec5bbbcaa2cce33022e?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
          browser_link:
            'https://www.jet.com/product/0147dccdb5984ec5bbbcaa2cce33022e?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
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
          app_link: 'jet://shop/uniquelyj?btn_ref=srctok-XXX',
          browser_link: 'https://www.jet.com/shop/uniquelyj?btn_ref=srctok-XXX',
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
          app_link: 'jet://shop/uniquelyj?btn_ref=srctok-XXX',
          browser_link: 'https://www.jet.com/shop/uniquelyj?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://jet.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.jet.com?btn_ref=srctok-XXX',
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
          app_link: 'https://jet.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link: 'https://www.jet.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with adjusted path app link for android homepage', function() {
      assert.deepEqual(this.builder.webAction({}, 'android', 'srctok-XXX'), {
        app_link: 'https://jet.bttn.io/landing?btn_ref=srctok-XXX',
        browser_link: 'https://www.jet.com?btn_ref=srctok-XXX',
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
          browser_link: 'https://www.jet.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://jet.com/product/0147dccdb5984ec5bbbcaa2cce33022e?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/product/0147dccdb5984ec5bbbcaa2cce33022e',
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
