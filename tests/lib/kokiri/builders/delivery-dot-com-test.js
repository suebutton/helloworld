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
        app_link: 'deliverydotcom://?btn_ref=srctok-XXX',
        browser_link: 'https://www.delivery.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'deliverydotcom://app?btn_ref=srctok-XXX',
        browser_link: 'https://www.delivery.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with no app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link: 'https://www.delivery.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://delivery.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.delivery.com?btn_ref=srctok-XXX',
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
          app_link: 'https://delivery.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link: 'https://www.delivery.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
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
          'ios',
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
