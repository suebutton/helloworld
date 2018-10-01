const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/hotels-dot-com', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-3573c6b896624279',
      },
      {
        status: 'approved',
        audience: 'org-2d432a88b9bb8bda',
        organization: 'org-3573c6b896624279',
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: 'org-3573c6b896624279',
        default_value: 'aff.hcom.GL.049.000.00699.019',
        name: 'rffrid-prefix',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: 'org-2d432a88b9bb8bda',
        value: 'aff.hcom.US.049.000.00695.019',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });
    this.builder = this.config.createBuilder('org-XXX', 'org-3573c6b896624279');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(
        this.builder.appAction(
          { hostname: 'www.hotels.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with a publisher-specific attribution id', function() {
      const builder = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-3573c6b896624279'
      );

      assert.deepEqual(
        builder.appAction({ hostname: 'www.hotels.com' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.US.049.000.00695.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.US.049.000.00695.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action to hotel details', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/ho212522/the-taj-mahal-palace-mumbai-mumbai-india/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCHotelDetails?hotelid=212522&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/ho212522/the-taj-mahal-palace-mumbai-mumbai-india?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/ho212522',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCHotelDetails?hotelid=212522&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/ho212522?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/ho212522',
            query: { a: 2 },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCHotelDetails?a=2&hotelid=212522&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/ho212522?a=2&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action to a destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/de172809/hotels-zurich-switzerland/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCSearch?destinationid=172809&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/de172809/hotels-zurich-switzerland?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/de172809',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCSearch?destinationid=172809&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/de172809?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/de172809',
            query: { a: 2 },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCSearch?a=2&destinationid=172809&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/de172809?a=2&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action to a venue page', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/hotel/details.html',
            query: {
              'q-check-out': '2017-06-25',
              'q-check-in': '2017-06-24',
              'hotel-id': '446763',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/hotel/details.html',
            query: {
              'q-check-out': '2017-06-25',
              'q-check-in': '2017-06-24',
              'hotel-id': '446763',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action to a search results page', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/search.do',
            query: { 'destination-id': '172809' },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/search.do?destination-id=172809&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/search.do?destination-id=172809&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/search.do',
            query: { 'destination-id': '172809' },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/search.do?destination-id=172809&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/search.do?destination-id=172809&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action to a search results page', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/hotel-deals',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/hotel-deals?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/hotel-deals?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/hotel-deals/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/hotel-deals?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/hotel-deals?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/hotel-dealsz/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.hotels.com/hotel-dealsz?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with pass-through destination for unknown app paths', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/bloop/2',
            query: { a: true },
            hash: 'anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.hotels.com/bloop/2?a=true&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX#anchor',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            pathname: '/bloop/2',
            query: { a: true },
            hash: 'anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.hotels.com/bloop/2?a=true&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX#anchor',
        }
      );
    });

    it('returns an app action with overwritten affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'www.hotels.com',
            query: { rffrid: 'pavel' },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for non-www hotels.com link', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'hotels.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for uk links', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'uk.hotels.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://uk.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for au links', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'au.hotels.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://au.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webAction(
          { hostname: 'www.hotels.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://hotels.bttn.io?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          { hostname: 'www.hotels.com', pathname: '/bloop', query: { a: 2 } },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://hotels.bttn.io/bloop?a=2&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/bloop?a=2&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action protecting affiliation parameters', function() {
      const query = {
        rffrid: 'pavel',
      };

      assert.deepEqual(
        this.builder.webAction(
          { hostname: 'www.hotels.com', query },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://hotels.bttn.io?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a web action for a non www link', function() {
    assert.deepEqual(
      this.builder.webAction({ hostname: 'hotels.com' }, 'ios', 'srctok-XXX'),
      {
        app_link:
          'https://hotels.bttn.io?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });

  it('returns a web action for a UK link', function() {
    assert.deepEqual(
      this.builder.webAction(
        { hostname: 'uk.hotels.com' },
        'ios',
        'srctok-XXX'
      ),
      {
        app_link:
          'https://hotels.bttn.io?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://uk.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl('https://www.hotels.com/1/2?q=2#anchor'),
      {
        hostname: 'www.hotels.com',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
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
