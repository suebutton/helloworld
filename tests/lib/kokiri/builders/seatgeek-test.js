const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const SEATGEEK_ORG_ID = 'org-00eb446216ab549a';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';

describe('lib/kokiri/builders/seatgeek', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: SEATGEEK_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: SEATGEEK_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: SEATGEEK_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: SEATGEEK_ORG_ID,
        default_value: 'ibotta',
        name: 'pid',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: IBOTTA_ORG_ID,
        value: 'ibotta',
      },
      {
        partner_parameter: '12345',
        organization: SHOPKICK_ORG_ID,
        value: 'shopkick',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', SEATGEEK_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'seatgeek://?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
        browser_link:
          'https://seatgeek.com?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'seatgeek://app?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
        browser_link:
          'https://seatgeek.com?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              aid: 'pavel',
              pid: 'pavel',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'seatgeek://?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
          browser_link:
            'https://seatgeek.com?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        SEATGEEK_ORG_ID
      );
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'seatgeek://?aid=12408&pid=shopkick&btn_ref=srctok-XXX',
        browser_link:
          'https://seatgeek.com?aid=12408&pid=shopkick&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
          browser_link:
            'https://seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?utm_campaign=BEST%20OIL&aid=12408&pid=ibotta&btn_ref=srctok-XXX',
          browser_link:
            'https://seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?utm_campaign=BEST%20OIL&aid=12408&pid=ibotta&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://seatgeek.bttn.io?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
        browser_link:
          'https://seatgeek.com?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            query: {
              aid: 'pavel',
              pid: 'pavel',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://seatgeek.bttn.io?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
          browser_link:
            'https://seatgeek.com?aid=12408&pid=ibotta&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        SEATGEEK_ORG_ID
      );
      assert.deepEqual(builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://seatgeek.bttn.io?aid=12408&pid=shopkick&btn_ref=srctok-XXX',
        browser_link:
          'https://seatgeek.com?aid=12408&pid=shopkick&btn_ref=srctok-XXX',
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
          app_link:
            'https://seatgeek.bttn.io/bloop?a=2&aid=12408&pid=ibotta&btn_ref=srctok-XXX',
          browser_link:
            'https://seatgeek.com/bloop?a=2&aid=12408&pid=ibotta&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?utm_campaign=BEST%20OIL'
      ),
      {
        pathname:
          '/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032',
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
