const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/ticketmaster', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-12442b0c35f7f8bb',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-12442b0c35f7f8bb');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'ticketmaster://?btn_ref=srctok-XXX',
        browser_link: null,
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'ticketmaster://?btn_ref=srctok-XXX',
        browser_link: null,
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
          app_link: 'ticketmaster:///item/p1297?a=2&btn_ref=srctok-XXX',
          browser_link: null,
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/item/p1297',
            query: { a: 2 },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'ticketmaster://?btn_ref=srctok-XXX',
          browser_link: null,
        }
      );
    });
  });

  describe('#webAction', function() {
    it(`can't web action`, function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://ticketmaster.bttn.io?btn_ref=srctok-XXX',
        browser_link: null,
      });
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://ticketmaster.com/items/p1297?utm_campaign=BEST%20OIL'
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
