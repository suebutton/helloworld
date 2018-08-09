const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const OVERSTOCK_ORG_ID = 'org-695642d20753707a';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';

describe('lib/kokiri/builders/overstock', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: OVERSTOCK_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: OVERSTOCK_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: OVERSTOCK_ORG_ID,
        default_value: 'Button',
        name: 'btn_aff',
      },
      {
        id: '11111',
        organization: OVERSTOCK_ORG_ID,
        default_value: '260521',
        name: 'cid',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: SHOPKICK_ORG_ID,
        value: 'Shopkick',
      },
      {
        partner_parameter: '11111',
        organization: SHOPKICK_ORG_ID,
        value: '276097',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', OVERSTOCK_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'ostk://www.overstock.com/home?PID=12345&AID=55555&affproviderId=4&CID=260521&btn_aff=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.overstock.com?siteId=4&SID=srctok-XXX&CID=260521&btn_aff=Button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'ostk://www.overstock.com/home?PID=12345&AID=55555&affproviderId=4&CID=260521&btn_aff=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.overstock.com?siteId=4&SID=srctok-XXX&CID=260521&btn_aff=Button&btn_ref=srctok-XXX',
      });
    });

    it('returns empty app action for non home page requests and browser action overrides affliaition parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/item/p1297',
            query: {
              a: 2,
              siteId: 'pavel',
              SID: 'pavel',
              CID: 'pavel',
              btn_aff: 'pavel',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.overstock.com/item/p1297?a=2&siteId=4&SID=srctok-XXX&CID=260521&btn_aff=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              a: 2,
              siteId: 'pavel',
              SID: 'pavel',
              CID: 'pavel',
              PID: 'pavel',
              AID: 'pavel',
              affproviderId: 'pavel',
              btn_aff: 'pavel',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ostk://www.overstock.com/home?PID=12345&AID=55555&affproviderId=4&CID=260521&btn_aff=Button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.overstock.com?a=2&siteId=4&SID=srctok-XXX&CID=260521&PID=pavel&AID=pavel&affproviderId=pavel&btn_aff=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        OVERSTOCK_ORG_ID
      );
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'ostk://www.overstock.com/home?PID=12345&AID=55555&affproviderId=4&CID=276097&btn_aff=Shopkick&btn_ref=srctok-XXX',
        browser_link:
          'https://www.overstock.com?siteId=4&SID=srctok-XXX&CID=276097&btn_aff=Shopkick&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://overstock.bttn.io/home?PID=12345&AID=55555&affproviderId=4&CID=260521&btn_aff=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.overstock.com?siteId=4&SID=srctok-XXX&CID=260521&btn_aff=Button&btn_ref=srctok-XXX',
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
            'https://www.overstock.com/bloop?a=2&siteId=4&SID=srctok-XXX&CID=260521&btn_aff=Button&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.overstock.com/items/p1297?utm_campaign=BEST%20OIL'
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
