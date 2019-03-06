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
      {
        status: 'approved',
        audience: 'org-11f5e62b4ebe0005',
        organization: 'org-3573c6b896624279',
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: 'org-3573c6b896624279',
        default_value: '00699.019',
        name: 'rffrid-number',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: 'org-2d432a88b9bb8bda',
        value: '00695.019',
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
        this.builder.appActionFromUrl(
          'https://www.hotels.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with a publisher-specific attribution id', function() {
      const builder = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-3573c6b896624279'
      );

      assert.deepEqual(
        builder.appActionFromUrl('https://www.hotels.com', 'ios', 'srctok-XXX'),
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
        this.builder.appActionFromUrl(
          'https://www.hotels.com/ho212522/the-taj-mahal-palace-mumbai-mumbai-india/',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCHotelDetails?hotelid=212522&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/ho212522/the-taj-mahal-palace-mumbai-mumbai-india?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/ho212522',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCHotelDetails?hotelid=212522&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/ho212522?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/ho212522?a=2',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCHotelDetails?a=2&hotelid=212522&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/ho212522?a=2&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action to a destination', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/de172809/hotels-zurich-switzerland/',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCSearch?destinationid=172809&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/de172809/hotels-zurich-switzerland?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/de172809',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCSearch?destinationid=172809&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/de172809?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/de172809?a=2',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/PPCSearch?a=2&destinationid=172809&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/de172809?a=2&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action to a venue page', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/hotel/details.html?q-check-out=2017-06-25&q-check-in=2017-06-24&hotel-id=446763&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action to a search results page', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/search.do?destination-id=172809',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/search.do?destination-id=172809&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/search.do?destination-id=172809&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/search.do?destination-id=172809',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/search.do?destination-id=172809&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/search.do?destination-id=172809&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action to a search results page', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/hotel-deals',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/hotel-deals?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/hotel-deals?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/hotel-deals/',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com/hotel-deals?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/hotel-deals?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/hotel-dealsz/',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.hotels.com/hotel-dealsz?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with pass-through destination for unknown app paths', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/bloop/2?a=true#anchor',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.hotels.com/bloop/2?a=true&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX#anchor',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com/bloop/2?a=true#anchor',
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.hotels.com/bloop/2?a=true&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX#anchor',
        }
      );
    });

    it('returns an app action with overwritten affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.hotels.com?rffrid=pavel',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for non-www hotels.com link', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://hotels.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for uk links', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://uk.hotels.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.UK.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://uk.hotels.com?rffrid=aff.hcom.UK.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for au links', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://au.hotels.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.AU.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://au.hotels.com?rffrid=aff.hcom.AU.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for Brazil links', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://hoteis.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.BR.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://hoteis.com?rffrid=aff.hcom.BR.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for LATAM links', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://hoteles.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.LM.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://hoteles.com?rffrid=aff.hcom.LM.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.hotels.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://hotels.bttn.io?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.hotels.com/bloop?a=2',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://hotels.bttn.io/bloop?a=2&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/bloop?a=2&rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action protecting affiliation parameters', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.hotels.com?rffrid=pavel',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://hotels.bttn.io?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a web action for a non www link', function() {
    assert.deepEqual(
      this.builder.webActionFromUrl('https://hotels.com', 'ios', 'srctok-XXX'),
      {
        app_link:
          'https://hotels.bttn.io?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });

  it('returns a web action for a UK link', function() {
    assert.deepEqual(
      this.builder.webActionFromUrl(
        'https://uk.hotels.com',
        'ios',
        'srctok-XXX'
      ),
      {
        app_link:
          'https://hotels.bttn.io?rffrid=aff.hcom.UK.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://uk.hotels.com?rffrid=aff.hcom.UK.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });

  it('returns a web action for a Brazil link', function() {
    assert.deepEqual(
      this.builder.webActionFromUrl('https://hoteis.com', 'ios', 'srctok-XXX'),
      {
        app_link:
          'https://hotels.bttn.io?rffrid=aff.hcom.BR.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://hoteis.com?rffrid=aff.hcom.BR.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });

  it('passes through rffrid for select publishers', function() {
    const builder = this.config.createBuilder(
      'org-11f5e62b4ebe0005',
      'org-3573c6b896624279'
    );

    assert.deepEqual(
      builder.webActionFromUrl(
        'https://hotels.com?rffrid=whatever-we-want.kwrd=1234',
        'ios',
        'srctok-XXX'
      ),
      {
        app_link:
          'https://hotels.bttn.io?rffrid=whatever-we-want.btn.kwrd%3D1234&btn_ref=srctok-XXX',
        browser_link:
          'https://hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );

    assert.deepEqual(
      builder.webActionFromUrl(
        'https://hotels.com?rffrid=seven',
        'ios',
        'srctok-XXX'
      ),
      {
        app_link: 'https://hotels.bttn.io?rffrid=seven&btn_ref=srctok-XXX',
        browser_link:
          'https://hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );

    assert.deepEqual(
      builder.webActionFromUrl('https://hotels.com', 'ios', 'srctok-XXX'),
      {
        app_link:
          'https://hotels.bttn.io?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });
  it('returns an app action for id links', function() {
    assert.deepEqual(
      this.builder.appActionFromUrl(
        'https://id.hotels.com',
        'ios',
        'srctok-XXX'
      ),
      {
        app_link:
          'hotelsapp://www.hotels.com?rffrid=aff.hcom.ID.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://id.hotels.com?rffrid=aff.hcom.ID.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });
  it('returns an app action for ms links', function() {
    assert.deepEqual(
      this.builder.appActionFromUrl(
        'https://ms.hotels.com',
        'ios',
        'srctok-XXX'
      ),
      {
        app_link:
          'hotelsapp://www.hotels.com?rffrid=aff.hcom.MS.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://ms.hotels.com?rffrid=aff.hcom.MS.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });
  it('returns an app action for ph links', function() {
    assert.deepEqual(
      this.builder.appActionFromUrl(
        'https://ph.hotels.com',
        'ios',
        'srctok-XXX'
      ),
      {
        app_link:
          'hotelsapp://www.hotels.com?rffrid=aff.hcom.PH.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://ph.hotels.com?rffrid=aff.hcom.PH.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });
  it('returns an app action for th links', function() {
    assert.deepEqual(
      this.builder.appActionFromUrl(
        'https://th.hotels.com',
        'ios',
        'srctok-XXX'
      ),
      {
        app_link:
          'hotelsapp://www.hotels.com?rffrid=aff.hcom.TH.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://th.hotels.com?rffrid=aff.hcom.TH.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });
  it('returns an app action for tw links', function() {
    assert.deepEqual(
      this.builder.appActionFromUrl(
        'https://tw.hotels.com',
        'ios',
        'srctok-XXX'
      ),
      {
        app_link:
          'hotelsapp://www.hotels.com?rffrid=aff.hcom.TW.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://tw.hotels.com?rffrid=aff.hcom.TW.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
      }
    );
  });
});
