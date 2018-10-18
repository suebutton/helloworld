const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const DOORDASH_ORG_ID = 'org-11fd3065b9c49c90';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/doordash', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: DOORDASH_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: DOORDASH_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: DOORDASH_ORG_ID,
        default_value: 'Button|Default|AllCustomers',
        name: 'utmcampaign',
      },
      {
        id: '54321',
        organization: DOORDASH_ORG_ID,
        default_value: 'Button|Default',
        name: 'utmsource',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: IBOTTA_ORG_ID,
        value: 'Button|Ibotta|AllCustomers',
      },
      {
        partner_parameter: '54321',
        organization: IBOTTA_ORG_ID,
        value: 'Button|Ibotta',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', DOORDASH_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'doordash://doordash.com?btn_ref=srctok-XXX',
        browser_link:
          'https://www.doordash.com?ignore_splash_experience=true&utm_medium=Affiliate&utm_campaign=Button%7CDefault%7CAllCustomers&utm_source=Button%7CDefault&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'doordash://doordash.com?btn_ref=srctok-XXX',
        browser_link:
          'https://www.doordash.com?ignore_splash_experience=true&utm_medium=Affiliate&utm_campaign=Button%7CDefault%7CAllCustomers&utm_source=Button%7CDefault&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://www.doordash.com/bloop?ignore_splash_experience=true&utm_medium=Affiliate&utm_campaign=Button%7CDefault%7CAllCustomers&utm_source=Button%7CDefault&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              utm_source: 'doughnuts',
              utm_campaign: 'fried',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'doordash://doordash.com?btn_ref=srctok-XXX',
          browser_link:
            'https://www.doordash.com?utm_source=Button%7CDefault&utm_campaign=Button%7CDefault%7CAllCustomers&ignore_splash_experience=true&utm_medium=Affiliate&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, DOORDASH_ORG_ID);
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'doordash://doordash.com?btn_ref=srctok-XXX',
        browser_link:
          'https://www.doordash.com?ignore_splash_experience=true&utm_medium=Affiliate&utm_campaign=Button%7CIbotta%7CAllCustomers&utm_source=Button%7CIbotta&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://doordash.bttn.io?btn_ref=srctok-XXX',
        browser_link:
          'https://www.doordash.com?ignore_splash_experience=true&utm_medium=Affiliate&utm_campaign=Button%7CDefault%7CAllCustomers&utm_source=Button%7CDefault&btn_ref=srctok-XXX',
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
          app_link: 'https://doordash.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link:
            'https://www.doordash.com/bloop?a=2&ignore_splash_experience=true&utm_medium=Affiliate&utm_campaign=Button%7CDefault%7CAllCustomers&utm_source=Button%7CDefault&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
