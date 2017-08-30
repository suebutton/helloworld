const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/linkshare', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-6ef589c578ab8ac6',
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-139f1edad7388c6a',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-6ef589c578ab8ac6');
  });

  describe('#appAction', function() {
    it('returns an app action for gamestop', function() {
      const gamestopBuilder = this.config.createBuilder(
        'org-XXX',
        'org-139f1edad7388c6a'
      );

      assert.deepEqual(
        gamestopBuilder.appAction(
          {
            url: 'http://www.gamestop.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=BLquFtB2nfI&mid=24348&murl=http%3A%2F%2Fwww.gamestop.com&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'http://www.techarmor.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=BLquFtB2nfI&mid=38275&murl=http%3A%2F%2Fwww.techarmor.com&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'http://www.techarmor.com',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=BLquFtB2nfI&mid=38275&murl=http%3A%2F%2Fwww.techarmor.com&u1=srctok-XXX&btn_ref=srctok-XXX',
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

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webAction(
          { url: 'https://techarmor.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://techarmor.bttn.io/deeplink?id=BLquFtB2nfI&mid=38275&murl=https%3A%2F%2Ftecharmor.com&u1=srctok-XXX&btn_refkey=u1&btn_ref=srctok-XXX',
          browser_link:
            'https://click.linksynergy.com/deeplink?id=BLquFtB2nfI&mid=38275&murl=https%3A%2F%2Ftecharmor.com&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          { url: 'https://techarmor.com/bloop?a=2' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://techarmor.bttn.io/deeplink?id=BLquFtB2nfI&mid=38275&murl=https%3A%2F%2Ftecharmor.com%2Fbloop%3Fa%3D2&u1=srctok-XXX&btn_refkey=u1&btn_ref=srctok-XXX',
          browser_link:
            'https://click.linksynergy.com/deeplink?id=BLquFtB2nfI&mid=38275&murl=https%3A%2F%2Ftecharmor.com%2Fbloop%3Fa%3D2&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            url: 'https://www.techarmor.com/iphone-7',
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/techarmor/deeplink?id=BLquFtB2nfI&mid=38275&murl=https%3A%2F%2Fwww.techarmor.com%2Fiphone-7&u1=srctok-XXX&btn_refkey=u1&btn_ref=srctok-XXX'
      );
    });
  });

  describe('#destinationFromUrl', function() {
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
