const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const EBAGS_ORG_ID = 'org-67cb320e6548dfb3';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';

describe('lib/kokiri/builders/ebags', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: EBAGS_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: EBAGS_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: EBAGS_ORG_ID,
        default_value: 'button',
        name: 'utmcampaign',
      },
      {
        id: '54321',
        organization: EBAGS_ORG_ID,
        default_value: 'BTNBN',
        name: 'sourceid',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: SHOPKICK_ORG_ID,
        value: 'shopkick',
      },
      {
        partner_parameter: '54321',
        organization: SHOPKICK_ORG_ID,
        value: 'BTNSK',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', EBAGS_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action for ios', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.ebags.com?sourceid=BTNBN&btnpid=org-XXX&utm_campaign=button&utm_source=button&utm_medium=affiliate&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.ebags.com?sourceid=BTNBN&btnpid=org-XXX&utm_campaign=button&utm_source=button&utm_medium=affiliate&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              sourceid: 'pavel',
              btnpid: 'pavel',
              utm_campaign: 'pavel',
              utm_source: 'pavel',
              utm_medium: 'pavel',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.ebags.com?sourceid=BTNBN&btnpid=org-XXX&utm_campaign=button&utm_source=button&utm_medium=affiliate&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(SHOPKICK_ORG_ID, EBAGS_ORG_ID);
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.ebags.com?sourceid=BTNSK&btnpid=org-030575eddb72b4df&utm_campaign=shopkick&utm_source=button&utm_medium=affiliate&btn_ref=srctok-XXX',
      });
    });

    it('returns a product app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/item/p1297',
            query: { a: 2 },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.ebags.com/item/p1297?a=2&sourceid=BTNBN&btnpid=org-XXX&utm_campaign=button&utm_source=button&utm_medium=affiliate&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.ebags.com?sourceid=BTNBN&btnpid=org-XXX&utm_campaign=button&utm_source=button&utm_medium=affiliate&btn_ref=srctok-XXX',
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
            'https://www.ebags.com/bloop?a=2&sourceid=BTNBN&btnpid=org-XXX&utm_campaign=button&utm_source=button&utm_medium=affiliate&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.ebags.com/items/p1297?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/items/p1297',
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
