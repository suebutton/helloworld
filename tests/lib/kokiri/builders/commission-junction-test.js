const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/commission-junction,', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-0b394cbf5a4d9aa8',
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-319e4a77607c0ae6',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-0b394cbf5a4d9aa8');
  });

  describe('#appAction', function() {
    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'https://drizly_cj.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.dpbolvw.net/click-8395017-12515534?sid=srctok-XXX&url=https%3A%2F%2Fdrizly.com%2F&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'https://drizly_cj.com',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.dpbolvw.net/click-8395017-12515534?sid=srctok-XXX&url=https%3A%2F%2Fdrizly.com%2F&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with destination and a path', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'https://drizly_cj.com/a/b/c?foo=bar#123',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://www.dpbolvw.net/click-8395017-12515534?sid=srctok-XXX&url=https%3A%2F%2Fdrizly.com%2Fa%2Fb%2Fc&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns app action with destination path when no url mapping', function() {
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
            url: 'https://drizly_cj.com',
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/drizly-cj/click-8395017-12515534?sid=srctok-XXX&url=https%3A%2F%2Fdrizly.com%2F&btn_refkey=sid&btn_ref=srctok-XXX'
      );
    });
  });
});
