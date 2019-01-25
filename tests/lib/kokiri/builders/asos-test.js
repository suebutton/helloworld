const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const ASOS_ORG_ID = 'org-3a546af44d7a007f';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/asos', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: ASOS_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: ASOS_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: ASOS_ORG_ID,
        default_value: '',
        name: 'locale',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: IBOTTA_ORG_ID,
        value: 'us',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', ASOS_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl('https://asos.com', 'ios', 'srctok-XXX'),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for android', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://asos.com',
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://asos.com/bloop',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://m.asos.com/bloop?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a us path on a us publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.appActionFromUrl(
          'https://asos.com/us/men',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://m.asos.com/us/men?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a US publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.appActionFromUrl('https://us.asos.com/', 'ios', 'srctok-XXX'),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com/us/?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a au.asos.com link', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://au.asos.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com/au/?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for asos.com/au as a homepage link', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://asos.com/au',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com/au?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a asos.fr link', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.asos.fr',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com/fr/?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a asos.de product link', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.asos.de/new-look/new-look-hallie-disco-jeans-mit-hohem-bund/prd/10396076',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'asos://product?iid=10396076&affid=20578&btn_ref=srctok-XXX',
          browser_link:
            'https://m.asos.com/de/new-look/new-look-hallie-disco-jeans-mit-hohem-bund/prd/10396076?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for an AU homepage link', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://asos.com/au',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com/au?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action when passed a /usa link for a US publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.appActionFromUrl('https://asos.com/usa', 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://m.asos.com/us/usa?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action when passed a asos.fr link for a US publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.appActionFromUrl('https://asos.fr', 'ios', 'srctok-XXX'),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com/fr/?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action when passed a asos.fr/us link for a US publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.appActionFromUrl('https://asos.fr/us', 'ios', 'srctok-XXX'),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com/us?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action when passed a au.asos.com/it link for a US publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.appActionFromUrl('https://au.asos.com/it', 'ios', 'srctok-XXX'),
        {
          app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
          browser_link: 'https://m.asos.com/it?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action and strips out params that should be omitted', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.asos.fr/asos-design/asos-design-doudoune-oversize-noir/prd/9507157?CTARef=Saved+Items+Image&ranMID=35719&ranEAID=QFGLnEolOWg&ranSiteID=QFGLnEolOWg-E6i_2IUmJD1H_sb2myosCQ&utm_source=Affiliate&utm_medium=LinkShare&utm_content=USNetwork.1&utm_campaign=QFGLnEolOWg&link=15&promo=307314&source=linkshare&affid=2135&channelref=Affiliate&pubref=QFGLnEolOWg&siteID=QFGLnEolOWg-E6i_2IUmJD1H_sb2myosCQ',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'asos://product?CTARef=Saved%20Items%20Image&link=15&promo=307314&affid=20578&iid=9507157&btn_ref=srctok-XXX',
          browser_link:
            'https://m.asos.com/fr/asos-design/asos-design-doudoune-oversize-noir/prd/9507157?CTARef=Saved%20Items%20Image&link=15&promo=307314&affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for product pages', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://asos.com/topcategory/subcategory/prd/1234',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://product?iid=1234&affid=20578&btn_ref=srctok-XXX',
          browser_link:
            'https://m.asos.com/topcategory/subcategory/prd/1234?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for product pages with locale in the path', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://asos.com/us/topcategory/subcategory/prd/1234',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://product?iid=1234&affid=20578&btn_ref=srctok-XXX',
          browser_link:
            'https://m.asos.com/us/topcategory/subcategory/prd/1234?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for category pages', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://asos.com/women/ctas/ss-fashion-trend-7/cat/?cid=10987',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://category?cid=10987&affid=20578&btn_ref=srctok-XXX',
          browser_link:
            'https://m.asos.com/women/ctas/ss-fashion-trend-7/cat/?cid=10987&affid=20578&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.asos.com/men/activewear/cat/?cid=26090',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://category?cid=26090&affid=20578&btn_ref=srctok-XXX',
          browser_link:
            'https://m.asos.com/men/activewear/cat/?cid=26090&affid=20578&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.asos.com/activewear/cat/?cid=26090',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'asos://category?cid=26090&affid=20578&btn_ref=srctok-XXX',
          browser_link:
            'https://m.asos.com/activewear/cat/?cid=26090&affid=20578&btn_ref=srctok-XXX',
        }
      );

      it('returns an app action for category pages with locale in the path', function() {
        assert.deepEqual(
          this.builder.appActionFromUrl(
            'https://asos.com/us/women/ctas/ss-fashion-trend-7/cat/?cid=10987',
            'ios',
            'srctok-XXX'
          ),
          {
            app_link:
              'asos://category?cid=10987&affid=20578&btn_ref=srctok-XXX',
            browser_link:
              'https://m.asos.com/us/women/ctas/ss-fashion-trend-7/cat/?cid=10987&affid=20578&btn_ref=srctok-XXX',
          }
        );
      });
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl('https://asos.com', 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link: 'https://m.asos.com?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action for a US publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.webActionFromUrl('https://asos.com', 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link: 'https://m.asos.com/us/?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://asos.com/bloop?a=2',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://m.asos.com/bloop?a=2&affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination for a US pub', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.webActionFromUrl(
          'https://asos.com/bloop?a=2',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://m.asos.com/us/bloop?a=2&affid=20578&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
