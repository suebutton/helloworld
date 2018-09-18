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

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-12442b0c35f7f8bb');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(
        this.builder.appAction(
          { url: 'https://ticketmaster.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'ticketmaster://?btn_ref=srctok-XXX',
          browser_link:
            'http://ticketmaster.evyy.net/c/415484/264167/4272?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fticketmaster.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for android', function() {
      assert.deepEqual(
        this.builder.appAction(
          { url: 'https://ticketmaster.com' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'ticketmaster://?btn_ref=srctok-XXX',
          browser_link:
            'http://ticketmaster.evyy.net/c/415484/264167/4272?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fticketmaster.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a product app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/item/p1297',
            query: { a: 2 },
            hash: null,
            url: 'https://ticketmaster.com/item/p1297?a=2',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'ticketmaster:///item/p1297?a=2&btn_ref=srctok-XXX',
          browser_link:
            'http://ticketmaster.evyy.net/c/415484/264167/4272?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fticketmaster.com%2Fitem%2Fp1297%3Fa%3D2&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/item/p1297',
            query: { a: 2 },
            hash: null,
            url: 'https://ticketmaster.com/item/p1297?a=2',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'ticketmaster://?btn_ref=srctok-XXX',
          browser_link:
            'http://ticketmaster.evyy.net/c/415484/264167/4272?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fticketmaster.com%2Fitem%2Fp1297%3Fa%3D2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a webAction for ios', function() {
      assert.deepEqual(
        this.builder.webAction(
          { url: 'https://ticketmaster.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'https://ticketmaster.bttn.io?btn_ref=srctok-XXX',
          browser_link:
            'http://ticketmaster.evyy.net/c/415484/264167/4272?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fticketmaster.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a webAction for android', function() {
      assert.deepEqual(
        this.builder.webAction(
          { url: 'https://ticketmaster.com' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'https://ticketmaster.bttn.io?btn_ref=srctok-XXX',
          browser_link:
            'http://ticketmaster.evyy.net/c/415484/264167/4272?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fticketmaster.com&btn_ref=srctok-XXX',
        }
      );
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
        url: 'https://ticketmaster.com/items/p1297?utm_campaign=BEST%20OIL',
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
