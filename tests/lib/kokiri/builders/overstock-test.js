const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/overstock', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-695642d20753707a',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-695642d20753707a');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'ostk://www.overstock.com/home?PID=12345&AID=55555&affproviderId=4&CID=260521&btn_ref=srctok-XXX',
        browser_link:
          'https://www.overstock.com?siteId=4&SID=srctok-XXX&CID=260521&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'ostk://www.overstock.com/home?PID=12345&AID=55555&affproviderId=4&CID=260521&btn_ref=srctok-XXX',
        browser_link:
          'https://www.overstock.com?siteId=4&SID=srctok-XXX&CID=260521&btn_ref=srctok-XXX',
      });
    });

    it('returns a product app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/item/p1297',
            query: { a: 2, siteId: 'pavel', SID: 'pavel', CID: 'pavel' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.overstock.com/item/p1297?a=2&siteId=4&SID=srctok-XXX&CID=260521&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://overstock.bttn.io/home?PID=12345&AID=55555&affproviderId=4&CID=260521&btn_ref=srctok-XXX',
        browser_link:
          'https://www.overstock.com?siteId=4&SID=srctok-XXX&CID=260521&btn_ref=srctok-XXX',
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
            'https://www.overstock.com/bloop?a=2&siteId=4&SID=srctok-XXX&CID=260521&btn_ref=srctok-XXX',
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
