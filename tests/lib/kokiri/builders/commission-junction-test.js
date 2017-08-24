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
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

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
            'http://www.dpbolvw.net/click-8395017-11393884?sid=srctok-XXX&url=https%3A%2F%2Fwww.express.com%2F&btn_ref=srctok-XXX',
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
            'http://www.dpbolvw.net/click-8395017-11393884?sid=srctok-XXX&url=https%3A%2F%2Fwww.express.com%2F&btn_ref=srctok-XXX',
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
            'http://www.dpbolvw.net/click-8395017-11393884?sid=srctok-XXX&url=https%3A%2F%2Fwww.express.com%2Fa%2Fb%2Fc%3Ffoo%3Dbar%23123&btn_ref=srctok-XXX',
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
            'http://www.dpbolvw.net/click-8395017-10410849?sid=srctok-XXX&url=https%3A%2F%2Fgap.com%2Fa%2Fb%2Fc&btn_ref=srctok-XXX',
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
            'http://www.dpbolvw.net/click-8395017-12922947?sid=srctok-XXX&url=https%3A%2F%2Fwww.stitchfix.com%2Fa%2Fb%2Fc&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns app action with null values if there is no org_id to mid mapping', function() {
      this.builder.merchantId = 'org-XXX';
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'http://www.example.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: null,
        }
      );
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'http://www.example.com',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: null,
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
  describe('#universalLink', function() {
    it('universal link returns null', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            url: 'https://www.express.com/',
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/express/click-8395017-11393884?sid=srctok-XXX&url=https%3A%2F%2Fwww.express.com%2F&btn_refkey=sid&btn_ref=srctok-XXX'
      );
    });
  });
});
