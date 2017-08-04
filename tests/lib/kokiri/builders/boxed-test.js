const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/boxed', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-372a59a7b6ddb53b',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-372a59a7b6ddb53b');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'boxedwholesale://boxed.com?btn_ref=srctok-XXX',
        browser_link: 'https://www.boxed.com?btn_ref=srctok-XXX',
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
            'boxedwholesale://boxed.com/product/129/special-k-red-berries-cereal-37-oz.-2-bags?btn_ref=srctok-XXX',
          browser_link:
            'https://www.boxed.com/product/129/special-k-red-berries-cereal-37-oz.-2-bags?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for category', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/products/category/137/lifestyle/',
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
            'boxedwholesale://boxed.com/products/category/137/lifestyle?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
          browser_link:
            'https://www.boxed.com/products/category/137/lifestyle?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
        'https://track.bttn.io/boxed?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/boxed?btn_ref=org-XXX'
      );
    });

    it('returns a universal link for product', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname:
              '/product/129/special-k-red-berries-cereal-37-oz.-2-bags/',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/boxed/product/129/special-k-red-berries-cereal-37-oz.-2-bags?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for category', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/products/category/137/lifestyle/',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/boxed/products/category/137/lifestyle?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX'
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
