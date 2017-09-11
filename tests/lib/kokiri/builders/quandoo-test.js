const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/quandoo', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-6b6a1003c3e5161f',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-6b6a1003c3e5161f');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'ubquandoo://?btn_ref=srctok-XXX',
        browser_link: null,
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'ubquandoo://?btn_ref=srctok-XXX',
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
          app_link: 'ubquandoo:///item/p1297?a=2&btn_ref=srctok-XXX',
          browser_link: null,
        }
      );
    });
  });

  describe('#webAction', function() {
    it(`can't web action`, function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link: null,
      });
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://quandoo.sg/items/p1297?utm_campaign=BEST%20OIL'
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
