const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const HACK_SHACK_ORG_ID = 'org-34078c4621166ed0';
const QUACK_SHACK_ORG_ID = 'org-625811031bd816a7';

describe('lib/kokiri/builders/hackshack', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: HACK_SHACK_ORG_ID,
      },
      {
        status: 'approved',
        audience: QUACK_SHACK_ORG_ID,
        organization: HACK_SHACK_ORG_ID,
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', HACK_SHACK_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'hackshack://?btn_ref=srctok-XXX',
        browser_link: 'https://hackshack.app?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'hackshack://?btn_ref=srctok-XXX',
        browser_link: 'https://hackshack.app?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a arbitrary path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: 'hackshack:///bloop?btn_ref=srctok-XXX',
          browser_link: 'https://hackshack.app/bloop?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://hackshack.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://hackshack.app?btn_ref=srctok-XXX',
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
          app_link: 'https://hackshack.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link: 'https://hackshack.app/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://hackshack.app/bloop?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/bloop',
        query: {
          utm_campaign: 'BEST OIL',
        },
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
