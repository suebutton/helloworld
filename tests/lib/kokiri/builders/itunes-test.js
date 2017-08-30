const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/itunes', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-08ddcdc47b8479f9',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-08ddcdc47b8479f9');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'itms://itunes.apple.com?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://itunes.apple.com?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a song', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/us/music-video/rolling-in-the-deep/id406215201',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'itms://itunes.apple.com/us/music-video/rolling-in-the-deep/id406215201?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://itunes.apple.com/us/music-video/rolling-in-the-deep/id406215201?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/us/music-video/rolling-in-the-deep/id406215201',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://itunes.apple.com/us/music-video/rolling-in-the-deep/id406215201?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for an album', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/us/album/21/id420075073',
            query: {
              utm_campaign: 'BEST OIL',
              app: 'music',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'itms://itunes.apple.com/us/album/21/id420075073?utm_campaign=BEST%20OIL&app=itunes&at=1000lquK&mt=1&ct=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://itunes.apple.com/us/album/21/id420075073?utm_campaign=BEST%20OIL&app=itunes&at=1000lquK&mt=1&ct=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://itunes.bttn.io?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_refkey=ct&btn_ref=srctok-XXX',
        browser_link:
          'https://itunes.apple.com?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_ref=srctok-XXX',
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
            'https://itunes.bttn.io/bloop?a=2&at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_refkey=ct&btn_ref=srctok-XXX',
          browser_link:
            'https://itunes.apple.com/bloop?a=2&at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with protected affiliation parameters', function() {
      const query = {
        at: 'pavel',
        mt: 'pavel',
        app: 'pavel',
        ct: 'pavel',
      };

      assert.deepEqual(this.builder.webAction({ query }, 'ios', 'srctok-XXX'), {
        app_link:
          'https://itunes.bttn.io?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_refkey=ct&btn_ref=srctok-XXX',
        browser_link:
          'https://itunes.apple.com?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
        'https://track.bttn.io/itunes?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_refkey=ct&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/itunes?at=1000lquK&mt=1&app=itunes&ct=org-XXX&btn_refkey=ct&btn_ref=org-XXX'
      );
    });

    it('returns a universal link for a song', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/us/music-video/rolling-in-the-deep/id406215201',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/itunes/us/music-video/rolling-in-the-deep/id406215201?at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_refkey=ct&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for an album', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/us/album/21/id420075073',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/itunes/us/album/21/id420075073?utm_campaign=BEST%20OIL&at=1000lquK&mt=1&app=itunes&ct=srctok-XXX&btn_refkey=ct&btn_ref=srctok-XXX'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.itunes.com/us/album/21/id420075073?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/us/album/21/id420075073',
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
