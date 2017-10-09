const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/spring', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-5f8137923a8ee6e3',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-5f8137923a8ee6e3');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'com.shopspring.spring://?hide_education=true&autologin=true&ref=button&btn_ref=srctok-XXX',
        browser_link: 'https://www.shopspring.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for product', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/products/53497978',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'com.shopspring.spring://products/53497978?hide_education=true&autologin=true&ref=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.shopspring.com/products/53497978?btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: 'products/53497978',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'com.shopspring.spring://products/53497978?hide_education=true&autologin=true&ref=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.shopspring.com/products/53497978?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for brand', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/brands/3047',
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
            'com.shopspring.spring://brands/3047?utm_campaign=BEST%20OIL&hide_education=true&autologin=true&ref=button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.shopspring.com/brands/3047?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns null for non-ios platforms', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/brands/3047',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: null,
          },
          'pavelOs',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.shopspring.com/brands/3047?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://shopspring.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.shopspring.com?btn_ref=srctok-XXX',
      });
    });

    it('returns a web action for android', function() {
      assert.deepEqual(this.builder.webAction({}, 'android', 'srctok-XXX'), {
        app_link: null,
        browser_link: 'https://www.shopspring.com?btn_ref=srctok-XXX',
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
          app_link: 'https://shopspring.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link:
            'https://www.shopspring.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.shopspring.com/brands/3047?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/brands/3047',
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
