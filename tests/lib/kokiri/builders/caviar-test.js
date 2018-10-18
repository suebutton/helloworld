const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/caviar', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-4bbe43f218248059',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-4bbe43f218248059');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'caviar-app://?btn_ref=srctok-XXX',
        browser_link: 'https://www.trycaviar.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/san-francisco/1428-haight-patio-cafe-and-creperie-2575',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'caviar-app:///merchant/2575?btn_ref=srctok-XXX',
          browser_link:
            'https://www.trycaviar.com/san-francisco/1428-haight-patio-cafe-and-creperie-2575?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/san-francisco/1428-haight-patio-cafe-and-creperie-2575',
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
            'caviar-app:///merchant/2575?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
          browser_link:
            'https://www.trycaviar.com/san-francisco/1428-haight-patio-cafe-and-creperie-2575?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns null app action with unsupported destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/san-francisco',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.trycaviar.com/san-francisco?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://caviar.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.trycaviar.com?btn_ref=srctok-XXX',
      });
    });

    it('returns a web action for restaurants', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/san-francisco/1428-haight-patio-cafe-and-creperie-2575',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'https://caviar.bttn.io/merchant/2575?btn_ref=srctok-XXX',
          browser_link:
            'https://www.trycaviar.com/san-francisco/1428-haight-patio-cafe-and-creperie-2575?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.trycaviar.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
