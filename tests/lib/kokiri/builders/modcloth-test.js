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
        app_link:
          'modcloth://modcloth.com?utm_source=Button&utm_medium=Affiliate&utm_campaign=org-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.modcloth.com?utm_source=Button&utm_medium=Affiliate&utm_campaign=org-XXX&btn_ref=srctok-XXX',
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
            'modcloth://modcloth.com/shop/tops/that-s-my-final-antler-graphic-tee-in-grey/156885.html?utm_source=Button&utm_medium=Affiliate&utm_campaign=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.modcloth.com/shop/tops/that-s-my-final-antler-graphic-tee-in-grey/156885.html?utm_source=Button&utm_medium=Affiliate&utm_campaign=org-XXX&btn_ref=srctok-XXX',
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
            'modcloth://modcloth.com/shop/pants?utm_campaign=org-XXX&utm_source=Button&utm_medium=Affiliate&btn_ref=srctok-XXX',
          browser_link:
            'https://www.modcloth.com/shop/pants?utm_campaign=org-XXX&utm_source=Button&utm_medium=Affiliate&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://modcloth.bttn.io?utm_source=Button&utm_medium=Affiliate&utm_campaign=org-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://www.modcloth.com?utm_source=Button&utm_medium=Affiliate&utm_campaign=org-XXX&btn_ref=srctok-XXX',
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
          app_link:
            'https://modcloth.bttn.io/bloop?a=2&utm_source=Button&utm_medium=Affiliate&utm_campaign=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.modcloth.com/bloop?a=2&utm_source=Button&utm_medium=Affiliate&utm_campaign=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
