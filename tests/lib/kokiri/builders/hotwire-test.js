const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const HOTWIRE_ORG_ID = 'org-7829938c0c640b81';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/hotwire', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: HOTWIRE_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: HOTWIRE_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: HOTWIRE_ORG_ID,
        default_value: '007',
        name: 'siteid',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: IBOTTA_ORG_ID,
        value: '100',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', HOTWIRE_ORG_ID);
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
          app_link: 'hotwireapp://?nwid=Bt&siteid=007&btn_ref=srctok-XXX',
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
          app_link: 'hotwireapp://?nwid=Bt&siteid=007&btn_ref=srctok-XXX',
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

    it('returns an app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          this.builder.getDestinationFromUrl(
            'https://www.hotwire.com?siteid=doughnuts&nwid=apples'
          ),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'hotwireapp://?siteid=007&nwid=Bt&btn_ref=srctok-XXX',
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.hotwire.com%3Fsiteid%3Ddoughnuts%26nwid%3Dapples&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, HOTWIRE_ORG_ID);
      assert.deepEqual(
        builder.appAction(
          { url: 'https://www.hotwire.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'hotwireapp://?nwid=Bt&siteid=100&btn_ref=srctok-XXX',
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-2d432a88b9bb8bda&sharedid=org-2d432a88b9bb8bda&u=https%3A%2F%2Fwww.hotwire.com&btn_tkn=srctok-XXX',
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
          app_link:
            'https://hotwire.bttn.io?nwid=Bt&siteid=007&btn_ref=srctok-XXX',
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
          app_link:
            'https://hotwire.bttn.io?nwid=Bt&siteid=007&btn_ref=srctok-XXX',
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
