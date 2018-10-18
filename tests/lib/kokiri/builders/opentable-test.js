const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/opentable', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-1381881532ffe9f4',
      },
      {
        status: 'approved',
        audience: 'org-290b2877c15d987b',
        organization: 'org-1381881532ffe9f4',
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: 'org-1381881532ffe9f4',
        default_value: 'btn-prod-refid',
        name: 'publisher-id',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: 'org-290b2877c15d987b',
        value: '169542',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', 'org-1381881532ffe9f4');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'opentable://?reengagement=1&partner_id=2183&invoke_id=133730&publisher_id=btn-prod-refid&btn_ref=srctok-XXX',
        browser_link:
          'https://www.opentable.com?reengagement=1&partner_id=2183&invoke_id=133730&publisher_id=btn-prod-refid&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'vnd.opentable.deeplink://opentable.com?reengagement=1&partner_id=2183&invoke_id=133730&publisher_id=btn-prod-refid&btn_ref=srctok-XXX',
        browser_link:
          'https://www.opentable.com?reengagement=1&partner_id=2183&invoke_id=133730&publisher_id=btn-prod-refid&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with specific publisher id', function() {
      const builder = this.config.createBuilder(
        'org-290b2877c15d987b',
        'org-1381881532ffe9f4'
      );

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'opentable://?reengagement=1&partner_id=2183&invoke_id=133730&publisher_id=169542&btn_ref=srctok-XXX',
        browser_link:
          'https://www.opentable.com?reengagement=1&partner_id=2183&invoke_id=133730&publisher_id=169542&btn_ref=srctok-XXX',
      });
    });

    it('returns a product app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/item/p1297',
            query: {
              a: 2,
              reengagement: 'pavel',
              partner_id: 'pavel',
              invoke_id: 'pavel',
              publisher_id: 'pavel',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.opentable.com/item/p1297?a=2&reengagement=1&partner_id=2183&invoke_id=133730&publisher_id=btn-prod-refid&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.opentable.com?reengagement=1&partner_id=2183&invoke_id=133730&publisher_id=btn-prod-refid&btn_ref=srctok-XXX',
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
            'https://www.opentable.com/bloop?a=2&reengagement=1&partner_id=2183&invoke_id=133730&publisher_id=btn-prod-refid&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
