const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/modcloth', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-382484c03d49c2e7',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-382484c03d49c2e7');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'modcloth://modcloth.com?btn_ref=srctok-XXX',
        browser_link: 'https://www.modcloth.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for product', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/shop/tops/that-s-my-final-antler-graphic-tee-in-grey/156885.html',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'modcloth://modcloth.com/shop/tops/that-s-my-final-antler-graphic-tee-in-grey/156885.html?btn_ref=srctok-XXX',
          browser_link:
            'https://www.modcloth.com/shop/tops/that-s-my-final-antler-graphic-tee-in-grey/156885.html?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for category', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/shop/pants/',
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
            'modcloth://modcloth.com/shop/pants?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
          browser_link:
            'https://www.modcloth.com/shop/pants?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://modcloth.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.modcloth.com?btn_ref=srctok-XXX',
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
          app_link: 'https://modcloth.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link: 'https://www.modcloth.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.modcloth.com/shop/pants/?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/shop/pants/',
        query: { utm_campaign: 'BEST OIL' },
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
