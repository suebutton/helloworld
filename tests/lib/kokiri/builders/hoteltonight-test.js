const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const HOTEL_TONIGHT_ORG_ID = 'org-36fe49ce9ccb9116';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/hoteltonight', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: HOTEL_TONIGHT_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: HOTEL_TONIGHT_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: HOTEL_TONIGHT_ORG_ID,
        default_value: 'Button',
        name: 'utm-campaign',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: IBOTTA_ORG_ID,
        value: 'Button_Ibotta',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', HOTEL_TONIGHT_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'hoteltonight://?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'hoteltonight://open?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for non-app paths', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/bloop', query: { utm_campaign: 'bleep', q: 2 } },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.hoteltonight.com/bloop?utm_campaign=Button&q=2&adjust_tracker=z5iwhj&utm_source=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for Ibotta', function() {
      const builder = this.config.createBuilder(
        IBOTTA_ORG_ID,
        HOTEL_TONIGHT_ORG_ID
      );

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'hoteltonight://?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button_Ibotta&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button_Ibotta&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for Ibotta Android', function() {
      const builder = this.config.createBuilder(
        IBOTTA_ORG_ID,
        HOTEL_TONIGHT_ORG_ID
      );

      assert.deepEqual(builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'hoteltonight://open?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button_Ibotta&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button_Ibotta&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://hoteltonight.bttn.io?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
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
            'https://hoteltonight.bttn.io/bloop?a=2&adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hoteltonight.com/bloop?a=2&adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action protecting affiliation parameters', function() {
      const query = {
        adjust_tracker: 'pavel',
        utm_source: 'pavel',
        utm_campaign: 'pavel',
      };

      assert.deepEqual(this.builder.webAction({ query }, 'ios', 'srctok-XXX'), {
        app_link:
          'https://hoteltonight.bttn.io?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
      });
    });
  });
});
