const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const APPLE_RETAIL_ORG_ID = 'org-6970ba034d932903';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/apple-retail', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: APPLE_RETAIL_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: APPLE_RETAIL_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: APPLE_RETAIL_ORG_ID,
        default_value: '1101lMpQ',
        name: 'camref-suffix',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: IBOTTA_ORG_ID,
        value: '1101ly5X',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', APPLE_RETAIL_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com?btn_ref=srctok-XXX',
        browser_link:
          'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com?btn_ref=srctok-XXX',
      });
    });

    it('returns a publisher-specific app action', function() {
      const builder = this.config.createBuilder(
        IBOTTA_ORG_ID,
        APPLE_RETAIL_ORG_ID
      );

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'http://aos.prf.hn/click/camref:1101ly5X/pubref:srctok-XXX/destination:http://www.apple.com?btn_ref=srctok-XXX',
        browser_link:
          'http://aos.prf.hn/click/camref:1101ly5X/pubref:srctok-XXX/destination:http://www.apple.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for beats', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/shop/accessories/all-accessories/beats',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/xc/beats//?btn_ref=srctok-XXX',
          browser_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/shop/accessories/all-accessories/beats?btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/shop/accessories/all-accessories/beats/1/2',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/xc/beats//?btn_ref=srctok-XXX',
          browser_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/shop/accessories/all-accessories/beats/1/2?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for mac', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/mac',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/xc/mac//?btn_ref=srctok-XXX',
          browser_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/mac?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for ipad', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ipad',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/xc/ipad//?btn_ref=srctok-XXX',
          browser_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/ipad?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for iphone', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/iphone',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/xc/iphone//?btn_ref=srctok-XXX',
          browser_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/iphone?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for watch', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/watch',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/xc/watch//?btn_ref=srctok-XXX',
          browser_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/watch?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for unsupported paths', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/bloop',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com?btn_ref=srctok-XXX',
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
          app_link: null,
          browser_link:
            'http://aos.prf.hn/click/camref:1101lMpQ/pubref:srctok-XXX/destination:http://www.apple.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.apple.com/shop/accessories/all-accessories/beats?q=2#anchor'
      ),
      {
        pathname: '/shop/accessories/all-accessories/beats',
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      pathname: null,
    });
  });
});
