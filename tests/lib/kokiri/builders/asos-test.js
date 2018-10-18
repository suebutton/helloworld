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
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
        browser_link: 'https://m.asos.com?affid=20578&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
        browser_link: 'https://m.asos.com?affid=20578&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
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
        builder.appAction({ pathname: '/us/men' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://m.asos.com/us/men?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a US publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'asos://home?affid=20578&btn_ref=srctok-XXX',
        browser_link: 'https://m.asos.com/us?affid=20578&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action when passed a /usa link for a US publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.appAction({ pathname: '/usa' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://m.asos.com/us/usa?affid=20578&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link: 'https://m.asos.com?affid=20578&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action for a US publisher', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link: 'https://m.asos.com/us?affid=20578&btn_ref=srctok-XXX',
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
            'https://m.asos.com/bloop?a=2&affid=20578&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination for a US pub', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, ASOS_ORG_ID);

      assert.deepEqual(
        builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
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
