const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/bloomthat', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-717bc2bbb268c3f6',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-717bc2bbb268c3f6');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'amp457f8c357d74d133d500488-98c3a082-af22-11e5-272d-00deb82fd81f://?btn_ref=srctok-XXX',
        browser_link: 'https://www.bloomthat.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/flowers/the-siena',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'amp457f8c357d74d133d500488-98c3a082-af22-11e5-272d-00deb82fd81f://?btn_ref=srctok-XXX',
          browser_link:
            'https://www.bloomthat.com/flowers/the-siena?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/flowers/the-siena',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.bloomthat.com/flowers/the-siena?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/flowers/the-siena',
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
            'amp457f8c357d74d133d500488-98c3a082-af22-11e5-272d-00deb82fd81f://?btn_ref=srctok-XXX',
          browser_link:
            'https://www.bloomthat.com/flowers/the-siena?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://bloomthat.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.bloomthat.com?btn_ref=srctok-XXX',
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
          app_link: 'https://bloomthat.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link:
            'https://www.bloomthat.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.bloomthat.com/flowers/the-siena?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/flowers/the-siena',
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
