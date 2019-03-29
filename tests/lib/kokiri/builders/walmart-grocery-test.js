// 2019-03-29 This builder has not been tested for affiliation and attribution accuracy
// and will be re-validated prior to launch in PEP-14219

const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/walmart-grocery', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-15bb1747e6047707',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-15bb1747e6047707');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'walmart-grocery://?btn_ref=srctok-XXX',
        browser_link: 'https://grocery.walmart.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://grocery.walmart.com',
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'walmart-grocery://?btn_ref=srctok-XXX',
          browser_link: 'https://grocery.walmart.com?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for product page link', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://grocery.walmart.com/ip/Kisses-Valentine-s-Lava-Cake-Milk-Chocolates-9-Oz/863733920',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'walmart-grocery://ip/Kisses-Valentine-s-Lava-Cake-Milk-Chocolates-9-Oz/863733920?btn_ref=srctok-XXX',
          browser_link:
            'https://grocery.walmart.com/ip/Kisses-Valentine-s-Lava-Cake-Milk-Chocolates-9-Oz/863733920?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for product search link', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://grocery.walmart.com/products?query=fruit%20smoothie',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'walmart-grocery://products?query=fruit%20smoothie&btn_ref=srctok-XXX',
          browser_link:
            'https://grocery.walmart.com/products?query=fruit%20smoothie&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns no app action for an unsupported link', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://grocery.walmart.com/bloop',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: 'https://grocery.walmart.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.grocery.walmart.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: 'https://grocery.walmart.com?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns no app link for unsupported app destination', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.grocery.walmart.com/bloop?a=2',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://grocery.walmart.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns app URL for product link', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://grocery.walmart.com/ip/Great-Value-Gluten-Free-Cream-Cheese-8-Oz/10452429',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://grocery.walmart.com/ip/Great-Value-Gluten-Free-Cream-Cheese-8-Oz/10452429?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns app URL for product search link', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://grocery.walmart.com/products?query=almonds%20dry%20roasted',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://grocery.walmart.com/products?query=almonds%20dry%20roasted&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
