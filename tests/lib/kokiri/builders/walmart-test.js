const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/walmart', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-2365a4c935cb296b',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-2365a4c935cb296b');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'walmart://?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
        browser_link:
          'https://www.walmart.com?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ip/12345678',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'walmart://ip/12345678?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/ip/12345678?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with destination from extended path', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ip/productname/12345678',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'walmart://ip/12345678?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/ip/productname/12345678?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ip/productname/154364818',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'walmart://ip/154364818?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/ip/productname/154364818?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with category search', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/cp/smart-home/1229875',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'walmart://search-department/1229875?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/cp/smart-home/1229875?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with category search and shorter ID', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/cp/smart-home/122987',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'walmart://search-department/122987?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/cp/smart-home/122987?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ip/12345678',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'walmart://ip/12345678?utm_campaign=BEST%20OIL&sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/ip/12345678?utm_campaign=BEST%20OIL&sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://walmart.bttn.io?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
        browser_link:
          'https://www.walmart.com?sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
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
          app_link:
            'https://walmart.bttn.io/bloop?a=2&sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
          browser_link:
            'https://www.walmart.com/bloop?a=2&sourceid=button-attribution-token--srctok-XXX&wmlspartner=btnntwk&affcmpid=2030436372&tmode=0000&veh=aff&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.walmart.com/ip/12345678?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/ip/12345678',
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
