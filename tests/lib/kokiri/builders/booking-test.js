const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/booking', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-4d6aaae0d30aaa7d',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-4d6aaae0d30aaa7d');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://booking.com?aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.booking.com?aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns an universal link action for hotel', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/hotel/us/tuscan-inn.html',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://booking.com/hotel/us/tuscan-inn.html?aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.booking.com/hotel/us/tuscan-inn.html?aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'srctok-XXX'),
        'https://track.bttn.io/booking?aid=858965&label=srctok-XXX&btn_refkey=label&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/booking?aid=858965&label=org-XXX&btn_refkey=label&btn_ref=org-XXX'
      );
    });

    it('returns a universal link for a hotel', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/hotel/us/tuscan-inn.html',
            query: {},
            hash: null,
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/booking/hotel/us/tuscan-inn.html?aid=858965&label=srctok-XXX&btn_refkey=label&btn_ref=srctok-XXX'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.booking.com/hotel/us/tuscan-inn.html?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/hotel/us/tuscan-inn.html',
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
