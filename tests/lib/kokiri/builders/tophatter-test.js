const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/tophatter', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-799ada74ea8a8b8c',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-799ada74ea8a8b8c');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'tophatter://?btn_ref=srctok-XXX',
        browser_link: 'https://www.tophatter.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'tophatter://?btn_ref=srctok-XXX',
        browser_link: 'https://www.tophatter.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link: 'https://www.tophatter.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a catalogs app path for iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/catalogs/',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'tophatter://catalogs?btn_ref=srctok-XXX',
          browser_link: 'https://www.tophatter.com/catalogs?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a catalogs app path for Android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/catalogs/',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'tophatter://catalogs?btn_ref=srctok-XXX',
          browser_link: 'https://www.tophatter.com/catalogs?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a catagories app path for iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/',
            query: { categories: 'free-shipping' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'tophatter://live/free-shipping?btn_ref=srctok-XXX',
          browser_link:
            'https://www.tophatter.com?categories=free-shipping&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a catagories app path for Android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/',
            query: { categories: 'free-shipping' },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'tophatter://live/free-shipping?btn_ref=srctok-XXX',
          browser_link:
            'https://www.tophatter.com?categories=free-shipping&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://tophatter.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.tophatter.com?btn_ref=srctok-XXX',
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
          app_link: 'https://tophatter.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link:
            'https://www.tophatter.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.tophatter.com/bloop?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/bloop',
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

  it('returns a web action with destination for a catalogs path', function() {
    assert.deepEqual(
      this.builder.webAction(
        {
          pathname: '/catalogs/',
          query: {},
          hash: null,
        },
        'ios',
        'srctok-XXX'
      ),
      {
        app_link: 'https://tophatter.bttn.io/catalogs?btn_ref=srctok-XXX',
        browser_link: 'https://www.tophatter.com/catalogs?btn_ref=srctok-XXX',
      }
    );
  });

  it('returns an web action with destination for a categories path', function() {
    assert.deepEqual(
      this.builder.webAction(
        {
          pathname: '/',
          query: { categories: 'free-shipping' },
          hash: null,
        },
        'ios',
        'srctok-XXX'
      ),
      {
        app_link:
          'https://tophatter.bttn.io?categories=free-shipping&btn_ref=srctok-XXX',
        browser_link:
          'https://www.tophatter.com?categories=free-shipping&btn_ref=srctok-XXX',
      }
    );
  });
});
