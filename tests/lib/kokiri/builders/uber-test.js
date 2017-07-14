const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/uber/', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-3f6f45d041e575c0',
      },
    ];

    const webToAppMappings = [
      {
        organization: 'org-3f6f45d041e575c0',
        subdomain_name: 'uber',
        external_host: 'https://uber.com',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], webToAppMappings, approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-3f6f45d041e575c0');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'uber://?btn_ref=srctok-XXX',
        browser_link: 'https://www.uber.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a ride', function() {
      assert.deepEqual(
        this.builder.appAction(
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
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'uber://?action=setPickup&pickup%5Blatitude%5D=40.7382752&pickup%5Blongitude%5D=-73.9822849&dropoff%5Blatitude%5D=40.7530763&dropoff%5Blongitude%5D=-74.0069671&pickup%5Bnickname%5D=start&dropoff%5Bnickname%5D=end&btn_ref=srctok-XXX',
          browser_link:
            'https://www.uber.com?action=setPickup&pickup%5Blatitude%5D=40.7382752&pickup%5Blongitude%5D=-73.9822849&dropoff%5Blatitude%5D=40.7530763&dropoff%5Blongitude%5D=-74.0069671&pickup%5Bnickname%5D=start&dropoff%5Bnickname%5D=end&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a univesal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'srctok-XXX'),
        'https://track.bttn.io/uber?btn_ref=srctok-XXX'
      );
    });

    it('returns a univesal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/uber?btn_ref=org-XXX'
      );
    });

    it('returns a univesal link for a ride', function() {
      assert.deepEqual(
        this.builder.universalLink(
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
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/uber?action=setPickup&pickup%5Blatitude%5D=40.7382752&pickup%5Blongitude%5D=-73.9822849&dropoff%5Blatitude%5D=40.7530763&dropoff%5Blongitude%5D=-74.0069671&pickup%5Bnickname%5D=start&dropoff%5Bnickname%5D=end&btn_ref=srctok-XXX'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.uber.com/?action=setPickup&pickup%5Blatitude%5D=40.7382752&pickup%5Blongitude%5D=-73.9822849&dropoff%5Blatitude%5D=40.7530763&dropoff%5Blongitude%5D=-74.0069671&pickup%5Bnickname%5D=start&dropoff%5Bnickname%5D=end'
      ),
      {
        hostname: 'www.uber.com',
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
      hostname: null,
      pathname: null,
      query: {},
      hash: null,
    });
  });
});
