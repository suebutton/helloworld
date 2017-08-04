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

    this.config = new KokiriConfig([], [], [], [], [], approvals);

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

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
        'https://track.bttn.io/caviar?btn_mobile_url=https%3A%2F%2Fwww.trycaviar.com%3Fbtn_ref%3Dsrctok-XXX&btn_ref=srctok-XXX'
      );

      assert.deepEqual(
        this.builder.universalLink({ pathname: '/' }, 'ios', 'srctok-XXX'),
        'https://track.bttn.io/caviar?btn_mobile_url=https%3A%2F%2Fwww.trycaviar.com%3Fbtn_ref%3Dsrctok-XXX&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link with static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/caviar?btn_mobile_url=https%3A%2F%2Fwww.trycaviar.com%3Fbtn_ref%3Dorg-XXX&btn_ref=org-XXX'
      );
    });

    it('returns a universal link with destination', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/san-francisco/1428-haight-patio-cafe-and-creperie-2575',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/caviar/merchant/2575?btn_mobile_url=https%3A%2F%2Fwww.trycaviar.com%2Fsan-francisco%2F1428-haight-patio-cafe-and-creperie-2575%3Fbtn_ref%3Dsrctok-XXX&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link with query parameters', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/san-francisco/1428-haight-patio-cafe-and-creperie-2575',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: 'anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/caviar/merchant/2575?utm_campaign=BEST%20OIL&btn_mobile_url=https%3A%2F%2Fwww.trycaviar.com%2Fsan-francisco%2F1428-haight-patio-cafe-and-creperie-2575%3Futm_campaign%3DBEST%2520OIL%26btn_ref%3Dsrctok-XXX%23anchor&btn_ref=srctok-XXX#anchor'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.trycaviar.com/san-francisco/1428-haight-patio-cafe-and-creperie-2575?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/san-francisco/1428-haight-patio-cafe-and-creperie-2575',
        query: {
          utm_campaign: 'BEST OIL',
        },
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
