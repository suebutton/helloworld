const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const APPLEMUSIC_ORG_ID = 'org-7e4081c0d88c5427';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';

describe('lib/kokiri/builders/apple-music', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: APPLEMUSIC_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: APPLEMUSIC_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: APPLEMUSIC_ORG_ID,
        default_value: '1000lura',
        name: 'at',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: SHOPKICK_ORG_ID,
        value: '40balloons',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', APPLEMUSIC_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'musics://geo.itunes.apple.com?at=1000lura&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://itunes.apple.com?at=1000lura&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
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
            'musics://geo.itunes.apple.com/us/music-video/rolling-in-the-deep/id406215201?at=1000lura&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://itunes.apple.com/us/music-video/rolling-in-the-deep/id406215201?at=1000lura&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
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
          app_link:
            'musics://geo.itunes.apple.com/us/music-video/rolling-in-the-deep/id406215201?at=1000lura&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://itunes.apple.com/us/music-video/rolling-in-the-deep/id406215201?at=1000lura&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
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
            'musics://geo.itunes.apple.com/us/album/21/id420075073?utm_campaign=BEST%20OIL&app=music&at=1000lura&mt=1&ct=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://itunes.apple.com/us/album/21/id420075073?utm_campaign=BEST%20OIL&app=music&at=1000lura&mt=1&ct=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        APPLEMUSIC_ORG_ID
      );
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'musics://geo.itunes.apple.com?at=40balloons&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://itunes.apple.com?at=40balloons&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('overwrites incoming at token and returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        APPLEMUSIC_ORG_ID
      );
      assert.deepEqual(
        builder.appAction(
          {
            query: {
              at: '100puppies',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'musics://geo.itunes.apple.com?at=40balloons&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://itunes.apple.com?at=40balloons&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://itunes.apple.com?at=1000lura&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
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
            'https://itunes.apple.com/bloop?a=2&at=1000lura&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
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
        app_link: null,
        browser_link:
          'https://itunes.apple.com?at=1000lura&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        APPLEMUSIC_ORG_ID
      );
      assert.deepEqual(builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://itunes.apple.com?at=40balloons&mt=1&app=music&ct=srctok-XXX&btn_ref=srctok-XXX',
      });
    });
  });
});
