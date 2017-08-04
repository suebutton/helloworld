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
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-6ef589c578ab8ac6');
  });

  describe('#appAction', function() {
    it('returns an app action with null values if no url is passed', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link: null,
      });

      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: null,
        browser_link: null,
      });
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
  describe('#universalLink', function() {
    it('universal link returns null', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            url: 'https://www.techarmor.com/iphone-7',
          },
          'ios',
          'srctok-XXX'
        ),
        null
      );
    });
  });
});
