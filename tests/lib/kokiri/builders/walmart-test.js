const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/walmart', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-2365a4c935cb296b',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-2365a4c935cb296b');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'walmart://?btn_ref=srctok-XXX',
        browser_link: 'https://www.walmart.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ip/12345678',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'walmart://ip/12345678?btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/ip/12345678?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with destination from extended path', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ip/productname/12345678',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'walmart://ip/12345678?btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/ip/productname/12345678?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ip/12345678',
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
            'walmart://ip/12345678?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/ip/12345678?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'srctok-XXX'),
        'https://track.bttn.io/walmart?btn_ref=srctok-XXX'
      );

      assert.deepEqual(
        this.builder.universalLink({ pathname: '/' }, 'srctok-XXX'),
        'https://track.bttn.io/walmart?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link with static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/walmart?btn_ref=org-XXX'
      );
    });

    it('returns a universal link with destination', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/ip/12345678',
            query: {},
            hash: null,
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/walmart/ip/12345678?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link with destination from extended path', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/ip/productname/12345678',
            query: {},
            hash: null,
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/walmart/ip/productname/12345678?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link with query parameters', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/ip/12345678',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: 'anchor',
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/walmart/ip/12345678?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX#anchor'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.walmart.com/ip/12345678?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/ip/12345678',
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
