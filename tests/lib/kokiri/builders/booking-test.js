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
      {
        status: 'approved',
        audience: 'org-030575eddb72b4df',
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
          'https://www.booking.com/index.html?aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.booking.com?aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for special publishers', function() {
      const builder = this.config.createBuilder(
        'org-030575eddb72b4df',
        'org-4d6aaae0d30aaa7d'
      );

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://www.booking.com/index.html?aid=1353900&label=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.booking.com?aid=1353900&label=srctok-XXX&btn_ref=srctok-XXX',
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
          app_link: null,
          browser_link:
            'https://www.booking.com/hotel/us/tuscan-inn.html?aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.booking.com?aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
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
          app_link: null,
          browser_link:
            'https://www.booking.com/bloop?a=2&aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with protected affiliation parameters', function() {
      const query = {
        aid: 'pavel',
        label: 'pavel',
      };

      assert.deepEqual(this.builder.webAction({ query }, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.booking.com?aid=858965&label=srctok-XXX&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
        null
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(this.builder.universalLink({}), null);
    });

    it('returns a universal link for a hotel', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/hotel/us/tuscan-inn.html',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        null
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
