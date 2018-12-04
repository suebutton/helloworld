const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const TEDBAKER_ORG_ID = 'org-1b6dd43d7491fcca';
const HP_ORG_ID = 'org-6bd3d6a70b2043a5';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/linkshare', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: TEDBAKER_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: HP_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-123',
        organization: HP_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: TEDBAKER_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: HP_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: 'org-123',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder(IBOTTA_ORG_ID, TEDBAKER_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action for Ted Baker on iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          this.builder.getDestinationFromUrl('https://www.tedbaker.com'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.awin1.com/cread.php?btn_tkn=srctok-XXX&clickref=srctok-XXX&awinmid=15258&awinaffid=535157&p=https%3A%2F%2Fwww.tedbaker.com',
        }
      );
    });

    it('returns an app action for Ted Baker on Android', function() {
      assert.deepEqual(
        this.builder.appAction(
          this.builder.getDestinationFromUrl('https://www.tedbaker.com'),
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.awin1.com/cread.php?btn_tkn=srctok-XXX&clickref=srctok-XXX&awinmid=15258&awinaffid=535157&p=https%3A%2F%2Fwww.tedbaker.com',
        }
      );
    });

    it('returns an app action for hp when hp.com is passed', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, HP_ORG_ID);
      assert.deepEqual(
        builder.appAction(
          this.builder.getDestinationFromUrl('https://www.hp.com'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.awin1.com/cread.php?btn_tkn=srctok-XXX&clickref=srctok-XXX&awinmid=7168&awinaffid=535157&p=https%3A%2F%2Fstore.hp.com',
        }
      );
    });

    it('returns an app action for hp when store.hp.com is passed', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, HP_ORG_ID);
      assert.deepEqual(
        builder.appAction(
          this.builder.getDestinationFromUrl('https://store.hp.com'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.awin1.com/cread.php?btn_tkn=srctok-XXX&clickref=srctok-XXX&awinmid=7168&awinaffid=535157&p=https%3A%2F%2Fstore.hp.com',
        }
      );
    });

    it('returns app action with null values if there is no org_id to merchantId mapping', function() {
      this.builder.merchantId = 'org-123';
      assert.deepEqual(
        this.builder.appAction(
          this.builder.getDestinationFromUrl('https://www.hp.com'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: null,
        }
      );
    });

    it('returns app action with null values if there is no org_id to PublisherId mapping', function() {
      const builder = this.config.createBuilder('org-123', HP_ORG_ID);
      assert.deepEqual(
        builder.appAction(
          builder.getDestinationFromUrl('https://www.hp.com'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: null,
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action for ted baker', function() {
      assert.deepEqual(
        this.builder.webAction(
          this.builder.getDestinationFromUrl('https://www.tedbaker.com'),
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.awin1.com/cread.php?btn_tkn=srctok-XXX&clickref=srctok-XXX&awinmid=15258&awinaffid=535157&p=https%3A%2F%2Fwww.tedbaker.com',
        }
      );
      assert.deepEqual(
        this.builder.webAction(
          this.builder.getDestinationFromUrl('https://www.tedbaker.com'),
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.awin1.com/cread.php?btn_tkn=srctok-XXX&clickref=srctok-XXX&awinmid=15258&awinaffid=535157&p=https%3A%2F%2Fwww.tedbaker.com',
        }
      );
    });
  });
});
