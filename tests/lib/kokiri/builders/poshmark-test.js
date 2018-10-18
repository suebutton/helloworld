const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const POSHMARK_ORG_ID = 'org-59593cbf9713a5fc';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/poshmark', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: POSHMARK_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: POSHMARK_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: POSHMARK_ORG_ID,
        default_value: 'button',
        name: 'utm_source',
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

    this.builder = this.config.createBuilder('org-XXX', POSHMARK_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'poshmark://?utm_source=button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.poshmark.com?utm_source=button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'poshmark://?utm_source=button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.poshmark.com?utm_source=button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with publisher-specific utm_source', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, POSHMARK_ORG_ID);

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'poshmark://?utm_source=ibotta&btn_ref=srctok-XXX',
        browser_link:
          'https://www.poshmark.com?utm_source=ibotta&btn_ref=srctok-XXX',
      });
    });

    it('returns a product app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/item/p1297',
            query: { a: 2, utm_source: 'pavel' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.poshmark.com/item/p1297?a=2&utm_source=button&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.poshmark.com?utm_source=button&btn_ref=srctok-XXX',
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
            'https://www.poshmark.com/bloop?a=2&utm_source=button&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
