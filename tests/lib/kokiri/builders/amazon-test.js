const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/amazon', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-3b6a623e75cc729c',
      },
      {
        status: 'approved',
        audience: 'org-2d432a88b9bb8bda',
        organization: 'org-3b6a623e75cc729c',
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: 'org-3b6a623e75cc729c',
        default_value: 'button',
        name: 'tag',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: 'org-2d432a88b9bb8bda',
        value: 'ibotta09-20',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', 'org-3b6a623e75cc729c');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'com.amazon.mobile.shopping.web://www.amazon.com?tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.amazon.com?tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for product', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/Amazon-Echo-Dot-Portable-Bluetooth-Speaker-with-Alexa-Black/dp/B01DFKC2SO',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'com.amazon.mobile.shopping.web://www.amazon.com/Amazon-Echo-Dot-Portable-Bluetooth-Speaker-with-Alexa-Black/dp/B01DFKC2SO?tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.amazon.com/Amazon-Echo-Dot-Portable-Bluetooth-Speaker-with-Alexa-Black/dp/B01DFKC2SO?tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for category', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/pet-shops-dogs-cats-hamsters-kittens/b/ref=nav_shopall_ps',
            query: {
              ie: 'UTF8',
              node: '2619533011',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'com.amazon.mobile.shopping.web://www.amazon.com/pet-shops-dogs-cats-hamsters-kittens/b/ref=nav_shopall_ps?ie=UTF8&node=2619533011&tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.amazon.com/pet-shops-dogs-cats-hamsters-kittens/b/ref=nav_shopall_ps?ie=UTF8&node=2619533011&tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns no app link for webview-only paths for Ibotta', function() {
      const builder = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-3b6a623e75cc729c'
      );
      assert.deepEqual(
        builder.appAction(
          {
            pathname: '/gp/kindle/ku/gift_landing',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.amazon.com/gp/kindle/ku/gift_landing?tag=ibotta09-20&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
      assert.deepEqual(
        builder.appAction(
          {
            pathname: '/gp/kindle/ku/gift_landing',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.amazon.com/gp/kindle/ku/gift_landing?tag=ibotta09-20&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
      assert.deepEqual(
        builder.appAction(
          {
            pathname: '/primeday',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.amazon.com/primeday?tag=ibotta09-20&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
      assert.deepEqual(
        builder.appAction(
          {
            pathname: '/b/',
            query: {
              node: '17892399011',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'com.amazon.mobile.shopping.web://www.amazon.com/b?node=17892399011&tag=ibotta09-20&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.amazon.com/b?node=17892399011&tag=ibotta09-20&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
      assert.deepEqual(
        builder.appAction(
          {
            pathname: '/b',
            query: {
              node: '16090799011',
              ref: 'frsh_tag_assoc',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'com.amazon.mobile.shopping.web://www.amazon.com/b?node=16090799011&ref=frsh_tag_assoc&tag=ibotta09-20&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.amazon.com/b?node=16090799011&ref=frsh_tag_assoc&tag=ibotta09-20&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns no app link for webview-only unlimted60 path for Ibotta', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/unlimited60',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.amazon.com/unlimited60?tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns no app link for webview-only unlimited 60 path for Ibotta', function() {
      const builder = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-3b6a623e75cc729c'
      );

      assert.deepEqual(
        builder.appAction(
          {
            pathname: '/unlimited60',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.amazon.com/unlimited60?tag=ibotta09-20&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.amazon.com?tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
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
            'https://www.amazon.com/bloop?a=2&tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with protected affiliation parameters', function() {
      const query = {
        tag: 'pavel',
        ascsubtag: 'pavel',
      };

      assert.deepEqual(this.builder.webAction({ query }, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.amazon.com?tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
      });
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.amazon.com/pet-shops-dogs-cats-hamsters-kittens/b/ref=nav_shopall_ps?ie=UTF8&node=2619533011'
      ),
      {
        pathname: '/pet-shops-dogs-cats-hamsters-kittens/b/ref=nav_shopall_ps',
        query: {
          ie: 'UTF8',
          node: '2619533011',
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
