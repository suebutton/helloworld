const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/hungryhouse', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-714d6d52c2e268ac',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-714d6d52c2e268ac');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'hungryhouse://hungryhouse.co.uk?btn_ref=srctok-XXX',
        browser_link: 'https://www.hungryhouse.co.uk?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for restaurant', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/italian-pizza',
            query: {},
            hash: '#menu',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hungryhouse://hungryhouse.co.uk/italian-pizza?btn_ref=srctok-XXX#menu',
          browser_link:
            'https://www.hungryhouse.co.uk/italian-pizza?btn_ref=srctok-XXX#menu',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a univesal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'srctok-XXX'),
        'https://track.bttn.io/hungryhouse?btn_ref=srctok-XXX'
      );
    });

    it('returns a univesal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/hungryhouse?btn_ref=org-XXX'
      );
    });

    it('returns a univesal link for restaurant', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/italian-pizza',
            query: {},
            hash: '#menu',
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/hungryhouse/italian-pizza?btn_ref=srctok-XXX#menu'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.hungryhouse.co.uk/italian-pizza?utm_campaign=BESTPIZZA#menu'
      ),
      {
        pathname: '/italian-pizza',
        query: { utm_campaign: 'BESTPIZZA' },
        hash: '#menu',
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      pathname: null,
      query: {},
      hash: null,
    });
  });
});
