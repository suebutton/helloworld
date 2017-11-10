const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/cheapoair', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-39fc5b25a4debc2e',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-39fc5b25a4debc2e');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'fpinapp://cheapoair?FpAffiliate=Button&t=f&tt=1&btn_ref=srctok-XXX',
        browser_link:
          'https://m.cheapoair.com?FpAffiliate=Button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/flights',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'fpinapp://cheapoair/remotesearchhandler?FpAffiliate=Button&t=f&tt=1&btn_ref=srctok-XXX',
          browser_link:
            'https://m.cheapoair.com/flights?FpAffiliate=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/flights',
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
            'fpinapp://cheapoair/remotesearchhandler?utm_campaign=BEST%20OIL&FpAffiliate=Button&t=f&tt=1&btn_ref=srctok-XXX',
          browser_link:
            'https://m.cheapoair.com/flights?utm_campaign=BEST%20OIL&FpAffiliate=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns null app action with unsupported destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/hotels',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://m.cheapoair.com/hotels?FpAffiliate=Button&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://cheapoair.bttn.io?FpAffiliate=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://m.cheapoair.com?FpAffiliate=Button&btn_ref=srctok-XXX',
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
            'https://cheapoair.bttn.io/bloop?a=2&FpAffiliate=Button&btn_ref=srctok-XXX',
          browser_link:
            'https://m.cheapoair.com/bloop?a=2&FpAffiliate=Button&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://m.cheapoair.com/flights?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/flights',
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
