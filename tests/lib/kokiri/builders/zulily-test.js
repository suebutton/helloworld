const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const ZULILY_ORG_ID = 'org-71667af58d3a875e';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/zulily', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: ZULILY_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: ZULILY_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: ZULILY_ORG_ID,
        default_value: 'button',
        name: 'tidpublisher',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: IBOTTA_ORG_ID,
        value: 'ibotta',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', ZULILY_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'zulily://action.show/view/newToday?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        browser_link:
          'https://www.zulily.com?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
      });
    });
    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'zulily://action.show/view/newToday?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        browser_link:
          'https://www.zulily.com?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
      });
    });
    it('returns no app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://www.zulily.com/bloop?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ZULILY_ORG_ID);
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'zulily://action.show/view/newToday?tid=33175671_srctok-XXX_org-2d432a88b9bb8bda_ibotta_&btn_ref=srctok-XXX',
        browser_link:
          'https://www.zulily.com?tid=33175671_srctok-XXX_org-2d432a88b9bb8bda_ibotta_&btn_ref=srctok-XXX',
      });
    });
    it('returns an app action for android for product page', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/p/2018-0901.html' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'zulily://action.show/view/product/0901?eventId=2018&tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
          browser_link:
            'https://www.zulily.com/p/2018-0901.html?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for ios for product page', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/p/2018-0901.html' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'zulily://action.show/product?productId=0901&eventId=2018&tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
          browser_link:
            'https://www.zulily.com/p/2018-0901.html?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for android for product page with slug', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/p/banana-loaf-2018-0901.html' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'zulily://action.show/view/product/0901?eventId=2018&tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
          browser_link:
            'https://www.zulily.com/p/banana-loaf-2018-0901.html?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for ios for product page', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/p/carrot-cake-donuts-2018-0901.html' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'zulily://action.show/product?productId=0901&eventId=2018&tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
          browser_link:
            'https://www.zulily.com/p/carrot-cake-donuts-2018-0901.html?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for ios for supported category page', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/health-and-beauty' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'zulily://action.show/view/category/healthBeauty?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
          browser_link:
            'https://www.zulily.com/health-and-beauty?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for supported category page', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/kids' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'zulily://action.show/view/category/kids?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
          browser_link:
            'https://www.zulily.com/kids?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for android for supported category page', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/health-and-beauty' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'zulily://action.show/view/category/healthBeauty?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
          browser_link:
            'https://www.zulily.com/health-and-beauty?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns no app action for android for not supported category page', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/dogs-of-button' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.zulily.com/dogs-of-button?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://zulily.bttn.io/action.show/view/newToday?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        browser_link:
          'https://www.zulily.com?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
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
            'https://www.zulily.com/bloop?a=2&tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for product page ', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/p/2012-0000.html' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://zulily.bttn.io/action.show/product?productId=0000&eventId=2012&tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
          browser_link:
            'https://www.zulily.com/p/2012-0000.html?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for supported category page ', function() {
      assert.deepEqual(
        this.builder.webAction({ pathname: '/girls' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'https://zulily.bttn.io/action.show/view/category/girls?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
          browser_link:
            'https://www.zulily.com/girls?tid=33175671_srctok-XXX_org-XXX_button_&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
