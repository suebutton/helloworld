const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const TARGET_ORG_ID = 'org-24621b367f4280bc';
const KOHLS_ORG_ID = 'org-2ef55bcceba936bf';
const MVMT_ORG_ID = 'org-22e0c0464157d00d';
const BACKCOUNTRY_ORG_ID = 'org-3bec3b5c0cac44ad';
const ENTERPRISE_ORG_ID = 'org-299546bbc4e4986b';
const COST_PLUS_WORLD_MARKET_ORG_ID = 'org-7c42436567440f84';
const ADVANCE_AUTO_PARTS_ORG_ID = 'org-77cd55d02f3aa0fa';
const SUPER_CHEWER_ORG_ID = 'org-5e3b5b2c179441ab';
const BARK_BOX_ORG_ID = 'org-6eada664b6b9c1ea';

const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';
const SAMSUNG_ORG_ID = 'org-4738195f8e741d19';
const SPENT_ORG_ID = 'org-7537ad90e42d2ec0';

describe('lib/kokiri/builders/impact-radius', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: TARGET_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: KOHLS_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: MVMT_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: BACKCOUNTRY_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: ENTERPRISE_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: COST_PLUS_WORLD_MARKET_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: ADVANCE_AUTO_PARTS_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: SUPER_CHEWER_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: BARK_BOX_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: BACKCOUNTRY_ORG_ID,
      },
      {
        status: 'approved',
        audience: SAMSUNG_ORG_ID,
        organization: BACKCOUNTRY_ORG_ID,
      },
      {
        status: 'approved',
        audience: SPENT_ORG_ID,
        organization: TARGET_ORG_ID,
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });
  });

  describe('#appAction', function() {
    it('returns an app action for each merchant', function() {
      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', TARGET_ORG_ID)
          .appAction({ url: 'https://www.target.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://goto.target.com/c/415484/81938/2092?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.target.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', KOHLS_ORG_ID)
          .appAction({ url: 'https://www.kohls.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://kohls.sjv.io/c/415484/362118/5349?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.kohls.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', MVMT_ORG_ID)
          .appAction({ url: 'https://www.mvmt.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://mvmt.7eer.net/c/415484/222268/3856?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.mvmt.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', BACKCOUNTRY_ORG_ID)
          .appAction(
            { url: 'https://www.backcountry.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.backcountry.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', ENTERPRISE_ORG_ID)
          .appAction(
            { url: 'https://www.enterprise.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://partners.enterprise.com/c/415484/304337/4720?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.enterprise.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', COST_PLUS_WORLD_MARKET_ORG_ID)
          .appAction(
            { url: 'https://www.worldmarket.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://cost-plus-world-market.evyy.net/c/415484/84047/2148?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.worldmarket.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', ADVANCE_AUTO_PARTS_ORG_ID)
          .appAction(
            { url: 'https://www.advanceautoparts.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://advance-auto-parts.evyy.net/c/415484/89591/2190?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fshop.advanceautoparts.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', ADVANCE_AUTO_PARTS_ORG_ID)
          .appAction(
            { url: 'https://shop.advanceautoparts.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://advance-auto-parts.evyy.net/c/415484/89591/2190?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fshop.advanceautoparts.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', ADVANCE_AUTO_PARTS_ORG_ID)
          .appAction(
            { url: 'https://advanceautoparts.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://advance-auto-parts.evyy.net/c/415484/89591/2190?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fshop.advanceautoparts.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', BARK_BOX_ORG_ID)
          .appAction({ url: 'https://www.barkbox.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://barkbox.evyy.net/c/415484/44431/1369?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.barkbox.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', SUPER_CHEWER_ORG_ID)
          .appAction(
            { url: 'https://www.superchewer.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://superchewer.7eer.net/c/415484/269883/4355?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.barkbox.com%2Fsuper-chewer&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns an app action for specific publishers', function() {
      assert.deepEqual(
        this.config
          .createBuilder(SPENT_ORG_ID, TARGET_ORG_ID)
          .appAction({ url: 'https://www.target.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://goto.target.com/c/381635/81938/2092?subId1=srctok-XXX&subId2=org-7537ad90e42d2ec0&sharedid=org-7537ad90e42d2ec0&u=https%3A%2F%2Fwww.target.com&btn_tkn=srctok-XXX',
        }
      );
      assert.deepEqual(
        this.config
          .createBuilder(SAMSUNG_ORG_ID, BACKCOUNTRY_ORG_ID)
          .appAction(
            { url: 'https://www.backcountry.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-4738195f8e741d19&sharedid=org-4738195f8e741d19&u=https%3A%2F%2Fwww.backcountry.com&btn_tkn=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', TARGET_ORG_ID)
          .webAction({ url: 'https://www.target.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://goto.target.com/c/415484/81938/2092?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.target.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', KOHLS_ORG_ID)
          .webAction({ url: 'https://www.kohls.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://kohls.sjv.io/c/415484/362118/5349?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.kohls.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', MVMT_ORG_ID)
          .webAction({ url: 'https://www.mvmt.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://mvmt.7eer.net/c/415484/222268/3856?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.mvmt.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', BACKCOUNTRY_ORG_ID)
          .webAction(
            { url: 'https://www.backcountry.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.backcountry.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', ENTERPRISE_ORG_ID)
          .webAction(
            { url: 'https://www.enterprise.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://partners.enterprise.com/c/415484/304337/4720?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.enterprise.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', COST_PLUS_WORLD_MARKET_ORG_ID)
          .webAction(
            { url: 'https://www.worldmarket.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'https://cost-plus-world-market.evyy.net/c/415484/84047/2148?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.worldmarket.com&btn_tkn=srctok-XXX',
        }
      );
    });
  });
});
