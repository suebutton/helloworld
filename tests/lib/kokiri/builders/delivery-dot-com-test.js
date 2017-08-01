const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/delivery-dot-com', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-0c9334a8b3947ccc',
      },
    ];

    const config = new KokiriConfig([], [], [], [], [], approvals);
    this.builder = config.createBuilder('org-XXX', 'org-0c9334a8b3947ccc');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://www.delivery.com?btn_ref=srctok-XXX',
        browser_link: 'https://www.delivery.com?btn_ref=srctok-XXX',
      });
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'srctok-XXX'),
        'https://track.bttn.io/delivery?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/delivery?btn_ref=org-XXX'
      );
    });

    it('returns a universal link with a destination', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/bloop/2',
            query: { a: true },
            hash: 'anchor',
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/delivery/bloop/2?a=true&btn_ref=srctok-XXX#anchor'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl('https://delivery.com/1/2?q=2#anchor'),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );
  });
});
