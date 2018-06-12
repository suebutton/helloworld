const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/commission-junction,', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-3acb6dc42678c843', // express staging
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-319e4a77607c0ae6', // gap staging
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-33fbd5f8fc3214c4', // stitch fix staging
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-36467c8b060acf5a', // sears  staging
      },
      {
        status: 'approved',
        audience: 'org-2d432a88b9bb8bda',
        organization: 'org-3acb6dc42678c843',
      },
      {
        status: 'approved',
        audience: 'org-030575eddb72b4df',
        organization: 'org-3acb6dc42678c843',
      },
      {
        status: 'approved',
        audience: 'org-4738195f8e741d19',
        organization: 'org-3acb6dc42678c843',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-3acb6dc42678c843');
  });

  describe('#appAction', function() {
    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_ref=srctok-XXX',
        }
      );
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with publisher-specific parameters', function() {
      const builder = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-3acb6dc42678c843'
      );

      assert.deepEqual(
        builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8415784/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with Shopkick org-id instead of Ibottas', function() {
      const builder = this.config.createBuilder(
        'org-030575eddb72b4df',
        'org-3acb6dc42678c843'
      );

      assert.deepEqual(
        builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8639622/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with Samsung org-id instead of Ibottas', function() {
      const builder = this.config.createBuilder(
        'org-4738195f8e741d19',
        'org-3acb6dc42678c843'
      );

      assert.deepEqual(
        builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8639622/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with destination and a path', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'https://www.express.com/a/b/c?foo=bar#123',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://www.express.com/a/b/c?ref=CJ1&btn_ref=srctok-XXX&foo=bar#123',
        }
      );
    });

    it('returns app action with destination path for gap', function() {
      const b = this.config.createBuilder('org-XXX', 'org-319e4a77607c0ae6');
      assert.deepEqual(
        b.appAction(
          {
            url: 'https://gap.com/a/b/c',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://gap.com/a/b/c?ref=CJ1&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns app action with destination path for stitch fix ', function() {
      const b = this.config.createBuilder('org-XXX', 'org-33fbd5f8fc3214c4');
      assert.deepEqual(
        b.appAction(
          {
            url: 'https://www.stitchfix.com/a/b/c',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://www.stitchfix.com/a/b/c?ref=CJ1&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns app action with destination path for m.sears.com', function() {
      const b = this.config.createBuilder('org-XXX', 'org-36467c8b060acf5a');
      assert.deepEqual(
        b.appAction(
          {
            url: 'https://m.sears.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://www.sears.com?ref=CJ1&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            url: 'http://merchant.net',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/http://merchant.net?ref=CJ1&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            url: 'http://merchant.com/1/2/3?a=2&b=3#anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/http://merchant.com/1/2/3?ref=CJ1&btn_ref=srctok-XXX&a=2&b=3#anchor',
        }
      );
    });
  });

  describe('destinationFromUrl', function() {
    it('returns a destination from a url', function() {
      assert.deepEqual(
        this.builder.destinationFromUrl('https://www.techarmor.com/iphone-7'),
        {
          url: 'https://www.techarmor.com/iphone-7',
        }
      );

      assert.deepEqual(this.builder.destinationFromUrl(''), {
        url: '',
      });
    });
  });
});
