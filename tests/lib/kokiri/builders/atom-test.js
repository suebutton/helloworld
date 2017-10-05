const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/atom', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-6c6c57762afd0d79',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-6c6c57762afd0d79');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'atom://?btn_ref=srctok-XXX',
        browser_link: 'https://www.atomtickets.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/movies/the-fate-of-the-furious/209338',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'atom:///ViewProductionDetails?productionId=209338&btn_ref=srctok-XXX',
          browser_link:
            'https://www.atomtickets.com/movies/the-fate-of-the-furious/209338?btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/movies/the-fate-of-the-furious/209338p',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.atomtickets.com/movies/the-fate-of-the-furious/209338p?btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/movies/the-fate-of-the-furious/p209338',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.atomtickets.com/movies/the-fate-of-the-furious/p209338?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/movies/the-fate-of-the-furious/209338',
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
            'atom:///ViewProductionDetails?utm_campaign=BEST%20OIL&productionId=209338&btn_ref=srctok-XXX',
          browser_link:
            'https://www.atomtickets.com/movies/the-fate-of-the-furious/209338?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://atomtickets.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.atomtickets.com?btn_ref=srctok-XXX',
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
          app_link: 'https://atomtickets.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link:
            'https://www.atomtickets.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.atomtickets.com/movies/the-fate-of-the-furious/209338?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/movies/the-fate-of-the-furious/209338',
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
