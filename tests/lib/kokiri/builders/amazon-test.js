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

    this.config = new KokiriConfig([], [], [], [], [], approvals);

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
      assert.deepEqual(
        this.builder.appAction(
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
            'https://www.amazon.com/gp/kindle/ku/gift_landing?tag=button&ascsubtag=srctok-XXX&btn_ref=srctok-XXX',
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
    });
  });

  describe('#universalLink', function() {
    it('returns a univesal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'srctok-XXX'),
        'https://track.bttn.io/amazon?tag=button&ascsubtag=srctok-XXX&btn_refkey=ascsubtag&btn_ref=srctok-XXX'
      );
    });

    it('returns a univesal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/amazon?tag=button&ascsubtag=org-XXX&btn_refkey=ascsubtag&btn_ref=org-XXX'
      );
    });

    it('returns a univesal link for product', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname:
              '/Amazon-Echo-Dot-Portable-Bluetooth-Speaker-with-Alexa-Black/dp/B01DFKC2SO',
            query: {},
            hash: null,
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/amazon/Amazon-Echo-Dot-Portable-Bluetooth-Speaker-with-Alexa-Black/dp/B01DFKC2SO?tag=button&ascsubtag=srctok-XXX&btn_refkey=ascsubtag&btn_ref=srctok-XXX'
      );
    });

    it('returns a univesal link for category', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname:
              '/pet-shops-dogs-cats-hamsters-kittens/b/ref=nav_shopall_ps',
            query: {
              ie: 'UTF8',
              node: '2619533011',
            },
            hash: null,
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/amazon/pet-shops-dogs-cats-hamsters-kittens/b/ref=nav_shopall_ps?ie=UTF8&node=2619533011&tag=button&ascsubtag=srctok-XXX&btn_refkey=ascsubtag&btn_ref=srctok-XXX'
      );
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
