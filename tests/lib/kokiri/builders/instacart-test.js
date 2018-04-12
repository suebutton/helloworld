const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/instacart', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-1b9289f2f9014476',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-1b9289f2f9014476');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'instacart://?btn_ref=srctok-XXX',
        browser_link: 'https://www.instacart.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'instacart://?btn_ref=srctok-XXX',
        browser_link: 'https://www.instacart.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link: 'https://www.instacart.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link: 'https://www.instacart.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an iOS app action with the correct grocer if requested', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/store/whole-foods/',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'instacart://store?retailer_slug=whole-foods&btn_ref=srctok-XXX',
          browser_link:
            'https://www.instacart.com/store/whole-foods?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an Android app action with the correct grocer if requested', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/store/whole-foods/',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'instacart://store/whole-foods?btn_ref=srctok-XXX',
          browser_link:
            'https://www.instacart.com/store/whole-foods?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an iOS app action with the correct search path if requested', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/store/whole-foods/search_v3/bananas',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'instacart://search?q=bananas&btn_ref=srctok-XXX',
          browser_link:
            'https://www.instacart.com/store/whole-foods/search_v3/bananas?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an Android app action with the correct search path if requested', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/store/whole-foods/search_v3/bananas',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'instacart://search?query=bananas&btn_ref=srctok-XXX',
          browser_link:
            'https://www.instacart.com/store/whole-foods/search_v3/bananas?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a browser_link web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link: 'https://www.instacart.com?btn_ref=srctok-XXX',
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
            'https://www.instacart.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a web app action with a browser_link containing the correct grocer for iOS if requested', function() {
    assert.deepEqual(
      this.builder.webAction(
        {
          pathname: '/store/whole-foods/',
          query: {},
          hash: null,
        },
        'ios',
        'srctok-XXX'
      ),
      {
        app_link: null,
        browser_link:
          'https://www.instacart.com/store/whole-foods?btn_ref=srctok-XXX',
      }
    );
  });

  it('returns a web app action with a browser_link containing the correct search for iOS if requested', function() {
    assert.deepEqual(
      this.builder.webAction(
        {
          pathname: '/store/whole-foods/search_v3/bananas',
          query: {},
          hash: null,
        },
        'ios',
        'srctok-XXX'
      ),
      {
        app_link: null,
        browser_link:
          'https://www.instacart.com/store/whole-foods/search_v3/bananas?btn_ref=srctok-XXX',
      }
    );
  });

  it('returns a web app action with a browser_link containing the correct grocer on Android if requested', function() {
    assert.deepEqual(
      this.builder.webAction(
        {
          pathname: '/store/whole-foods/',
          query: {},
          hash: null,
        },
        'android',
        'srctok-XXX'
      ),
      {
        app_link: null,
        browser_link:
          'https://www.instacart.com/store/whole-foods?btn_ref=srctok-XXX',
      }
    );
  });

  it('returns a web app action with a browser_link containing the correct search on Android if requested', function() {
    assert.deepEqual(
      this.builder.webAction(
        {
          pathname: '/store/whole-foods/search_v3/bananas',
          query: {},
          hash: null,
        },
        'android',
        'srctok-XXX'
      ),
      {
        app_link: null,
        browser_link:
          'https://www.instacart.com/store/whole-foods/search_v3/bananas?btn_ref=srctok-XXX',
      }
    );
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.instacart.com/bloop?utm_campaign=BEST%20OIL'
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
});
