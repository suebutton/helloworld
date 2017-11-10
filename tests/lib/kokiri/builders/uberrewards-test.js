const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/uberrewards', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-71d525a52970fe14',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-71d525a52970fe14');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'uber://?btn_ref=srctok-XXX',
        browser_link: null,
      });
    });

    it('returns an app action for a ride', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'get.uber.com',
            pathname: '/',
            query: {
              action: 'setPickup',
              'pickup[latitude]': '40.7382752',
              'pickup[longitude]': '-73.9822849',
              'dropoff[latitude]': '40.7530763',
              'dropoff[longitude]': '-74.0069671',
              'pickup[nickname]': 'start',
              'dropoff[nickname]': 'end',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'uber://?action=setPickup&pickup%5Blatitude%5D=40.7382752&pickup%5Blongitude%5D=-73.9822849&dropoff%5Blatitude%5D=40.7530763&dropoff%5Blongitude%5D=-74.0069671&pickup%5Bnickname%5D=start&dropoff%5Bnickname%5D=end&btn_ref=srctok-XXX',
          browser_link: null,
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://uberm.bttn.io?btn_ref=srctok-XXX',
        browser_link: null,
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
          app_link: 'https://uberm.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link: null,
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://get.uber.com/?action=setPickup&pickup%5Blatitude%5D=40.7382752&pickup%5Blongitude%5D=-73.9822849&dropoff%5Blatitude%5D=40.7530763&dropoff%5Blongitude%5D=-74.0069671&pickup%5Bnickname%5D=start&dropoff%5Bnickname%5D=end'
      ),
      {
        pathname: '/',
        query: {
          action: 'setPickup',
          'pickup[latitude]': '40.7382752',
          'pickup[longitude]': '-73.9822849',
          'dropoff[latitude]': '40.7530763',
          'dropoff[longitude]': '-74.0069671',
          'pickup[nickname]': 'start',
          'dropoff[nickname]': 'end',
        },
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
