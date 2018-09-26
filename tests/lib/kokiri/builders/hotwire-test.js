const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/hotwire', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-7829938c0c640b81',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-7829938c0c640b81');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(
        this.builder.appAction(
          { url: 'https://www.hotwire.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'hotwireapp://?btn_ref=srctok-XXX',
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.hotwire.com&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns an app action for android', function() {
      assert.deepEqual(
        this.builder.appAction(
          { url: 'https://www.hotwire.com' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'hotwireapp://?btn_ref=srctok-XXX',
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.hotwire.com&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/bloop', url: 'https://www.hotwire.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.hotwire.com&btn_tkn=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a webAction for ios', function() {
      assert.deepEqual(
        this.builder.webAction(
          { url: 'https://www.hotwire.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'https://hotwire.bttn.io?btn_ref=srctok-XXX',
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.hotwire.com&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns a webAction for android', function() {
      assert.deepEqual(
        this.builder.webAction(
          { url: 'https://www.hotwire.com' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'https://hotwire.bttn.io?btn_ref=srctok-XXX',
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.hotwire.com&btn_tkn=srctok-XXX',
        }
      );
    });
    it('returns a destination from a url', function() {
      assert.deepEqual(
        this.builder.destinationFromUrl(
          'https://www.hotwire.com/car-rentals?utm_campaign=BEST%20OIL'
        ),
        {
          pathname: '/car-rentals',
          query: { utm_campaign: 'BEST OIL' },
          hash: null,
          url: 'https://www.hotwire.com/car-rentals?utm_campaign=BEST%20OIL',
        }
      );

      assert.deepEqual(this.builder.destinationFromUrl(''), {
        pathname: null,
        query: {},
        hash: null,
        url: '',
      });
    });
  });
});
