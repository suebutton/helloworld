const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/drizly', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-1d159507be3d049e',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-1d159507be3d049e');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'drizly://?btn_ref=srctok-XXX',
        browser_link: 'https://www.drizly.com?btn_ref=srctok-XXX',
      });
    });

    it('returns a product app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/kendall-jackson-chardonnay/p1297',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'drizly://catalog_item/p1297?btn_ref=srctok-XXX',
          browser_link:
            'https://www.drizly.com/kendall-jackson-chardonnay/p1297?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a category app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/sauvignon-blanc/c64',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'drizly://category/c64?btn_ref=srctok-XXX',
          browser_link:
            'https://www.drizly.com/sauvignon-blanc/c64?btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/kendall-jackson-chardonnay/j1297',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.drizly.com/kendall-jackson-chardonnay/j1297?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/kendall-jackson-chardonnay/p1297',
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
            'drizly://catalog_item/p1297?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
          browser_link:
            'https://www.drizly.com/kendall-jackson-chardonnay/p1297?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/kendall-jackson-chardonnay/p1297f',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.drizly.com/kendall-jackson-chardonnay/p1297f?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://drizly.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.drizly.com?btn_ref=srctok-XXX',
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
          app_link: 'https://drizly.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link: 'https://www.drizly.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.drizly.com/kendall-jackson-chardonnay/p1297?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/kendall-jackson-chardonnay/p1297',
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
