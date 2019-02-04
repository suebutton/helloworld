const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const EXPRESS_ORG_ID = 'org-3acb6dc42678c843';
const GAP_ORG_ID = 'org-319e4a77607c0ae6';
const SEARS_ORG_ID = 'org-36467c8b060acf5a';
const OLDNAVY_ORG_ID = 'org-430deef57127f23a';

const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';
const SAMSUNG_ORG_ID = 'org-4738195f8e741d19';

describe('lib/kokiri/builders/commission-junction,', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: EXPRESS_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: GAP_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: SEARS_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: OLDNAVY_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: EXPRESS_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: EXPRESS_ORG_ID,
      },
      {
        status: 'approved',
        audience: SAMSUNG_ORG_ID,
        organization: EXPRESS_ORG_ID,
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', EXPRESS_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns an app action with publisher-specific parameters', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, EXPRESS_ORG_ID);

      assert.deepEqual(
        builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8415784/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns an app action for Shopkick instead of Ibotta', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        EXPRESS_ORG_ID
      );

      assert.deepEqual(
        builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8639622/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns an app action for Samsung instead of Ibotta', function() {
      const builder = this.config.createBuilder(SAMSUNG_ORG_ID, EXPRESS_ORG_ID);

      assert.deepEqual(
        builder.appAction(
          {
            url: 'https://www.express.com/',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8822964/type/dlg/sid/srctok-XXX/https://www.express.com?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns an app action with destination and a path', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'https://www.express.com/a/b/c?foo=bar#123',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://www.express.com/a/b/c?ref=CJ1&btn_tkn=srctok-XXX&foo=bar#123',
        }
      );
    });

    it('returns app action with destination path for gap', function() {
      const b = this.config.createBuilder('org-XXX', GAP_ORG_ID);
      assert.deepEqual(
        b.appAction(
          {
            url: 'https://gap.com/a/b/c',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://gap.com/a/b/c?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns app action with destination path for m.sears.com', function() {
      const b = this.config.createBuilder('org-XXX', SEARS_ORG_ID);
      assert.deepEqual(
        b.appAction(
          {
            url: 'https://m.sears.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://www.sears.com?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns app action with destination path for oldnavy.gap.com', function() {
      const b = this.config.createBuilder('org-XXX', OLDNAVY_ORG_ID);
      assert.deepEqual(
        b.appAction(
          {
            url: 'https://oldnavy.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://oldnavy.gap.com?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns app action with destination path for oldnavy.gap.com', function() {
      const b = this.config.createBuilder('org-XXX', OLDNAVY_ORG_ID);
      assert.deepEqual(
        b.appAction(
          {
            url: 'https://www.oldnavy.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://oldnavy.gap.com?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            url: 'https://merchant.net',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://merchant.net?ref=CJ1&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            url: 'https://merchant.com/1/2/3?a=2&b=3#anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.anrdoezrs.net/links/8395017/type/dlg/sid/srctok-XXX/https://merchant.com/1/2/3?ref=CJ1&btn_tkn=srctok-XXX&a=2&b=3#anchor',
        }
      );
    });
  });
});
