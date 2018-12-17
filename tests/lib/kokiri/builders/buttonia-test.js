const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const BUTTONIA_ORG_ID = 'org-34078c4621166ed0';
const QUACK_SHACK_ORG_ID = 'org-625811031bd816a7';

describe('lib/kokiri/builders/buttonia', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: BUTTONIA_ORG_ID,
      },
      {
        status: 'approved',
        audience: QUACK_SHACK_ORG_ID,
        organization: BUTTONIA_ORG_ID,
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', BUTTONIA_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'buttonia://?btn_ref=srctok-XXX',
        browser_link: 'https://www.buttonia.co?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'buttonia://?btn_ref=srctok-XXX',
        browser_link: 'https://www.buttonia.co?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a arbitrary path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: 'buttonia:///bloop?btn_ref=srctok-XXX',
          browser_link: 'https://www.buttonia.co/bloop?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://buttonia.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.buttonia.co?btn_ref=srctok-XXX',
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
          app_link: 'https://buttonia.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link: 'https://www.buttonia.co/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
