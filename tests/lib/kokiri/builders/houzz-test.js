const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const HOUZZ_ORG_ID = 'org-03418dec42db44bc';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/houzz', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: HOUZZ_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: HOUZZ_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12',
        organization: HOUZZ_ORG_ID,
        default_value: 'us-ptr-mpl-btn-0000',
        name: 'refid',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12',
        organization: IBOTTA_ORG_ID,
        value: 'us-ptr-mpl-btn-471159',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', HOUZZ_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'houzz://?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
        browser_link:
          'https://www.houzz.com?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'houzz://?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
        browser_link:
          'https://www.houzz.com?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for any path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'houzz:///bloop?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
          browser_link:
            'https://www.houzz.com/bloop?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for android for any path', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/dogs-of-button' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'houzz:///dogs-of-button?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
          browser_link:
            'https://www.houzz.com/dogs-of-button?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for UK TLD', function() {
      assert.deepEqual(
        this.builder.appAction(
          { hostname: 'www.houzz.co.uk' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'houzz://?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
          browser_link:
            'https://www.houzz.co.uk?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              refid: 'cats',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'houzz://?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
          browser_link:
            'https://www.houzz.com?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, HOUZZ_ORG_ID);
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'houzz://?refid=us-ptr-mpl-btn-471159&btn_ref=srctok-XXX',
        browser_link:
          'https://www.houzz.com?refid=us-ptr-mpl-btn-471159&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://houzz.bttn.io?refid=us-ptr-mpl-btn-0000&btn_fallback_exp=web&btn_ref=srctok-XXX',
        browser_link:
          'https://www.houzz.com?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action for UK TLD', function() {
      assert.deepEqual(
        this.builder.webAction(
          { hostname: 'www.houzz.co.uk' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://houzz.bttn.io?refid=us-ptr-mpl-btn-0000&btn_fallback_exp=web&btn_ref=srctok-XXX',
          browser_link:
            'https://www.houzz.co.uk?refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://houzz.bttn.io/bloop?a=2&refid=us-ptr-mpl-btn-0000&btn_fallback_exp=web&btn_ref=srctok-XXX',
          browser_link:
            'https://www.houzz.com/bloop?a=2&refid=us-ptr-mpl-btn-0000&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
