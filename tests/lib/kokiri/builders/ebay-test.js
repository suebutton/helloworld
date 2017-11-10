const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const EBAY_ORG_ID = 'org-5d63b849c1d24db2';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';

describe('lib/kokiri/builders/ebay', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: EBAY_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: EBAY_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        default_value: '5575211063',
        name: 'pub',
        organization: EBAY_ORG_ID,
      },
      {
        id: '54321',
        default_value: '5337936547',
        name: 'campid',
        organization: EBAY_ORG_ID,
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        value: '5575309782',
        organization: SHOPKICK_ORG_ID,
      },
      {
        partner_parameter: '54321',
        value: '5338106664',
        organization: SHOPKICK_ORG_ID,
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });
    this.builder = this.config.createBuilder('org-XXX', EBAY_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'ebay://rover.ebay.com/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        browser_link:
          'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with non-.com TLD', function() {
      assert.deepEqual(
        this.builder.appAction(
          { hostname: 'www.ebay.co.uk' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://rover.ebay.com/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.co.uk&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.co.uk&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action overriding affiliation paremeters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              ff3: 'pavel',
              toolid: 'pavel',
              pub: 'pavel',
              campid: 'pavel',
              customid: 'pavel',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://rover.ebay.com/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(SHOPKICK_ORG_ID, EBAY_ORG_ID);
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'ebay://rover.ebay.com/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575309782&campid=5338106664&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        browser_link:
          'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575309782&campid=5338106664&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
      });
    });

    it('returns a web action with non-.com TLD', function() {
      assert.deepEqual(
        this.builder.webAction(
          { hostname: 'www.ebay.co.uk' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.co.uk&btn_ref=srctok-XXX',
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
          app_link: null,
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fbloop%3Fa%3D2&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with affiliation parameters protected', function() {
      const query = {
        ff3: 'pavel',
        toolid: 'pavel',
        pub: 'pavel',
        campid: 'pavel',
        customid: 'pavel',
      };

      assert.deepEqual(this.builder.webAction({ query }, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
      });
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://ebay.com/1/2?q=2&mpre=http%3A%2F%2Fwww.ebay.com#anchor'
      ),
      {
        hostname: 'ebay.com',
        pathname: '/1/2',
        query: { q: '2', mpre: 'http://www.ebay.com' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.ebay.co.uk/1/2?q=2&mpre=http%3A%2F%2Fwww.ebay.com#anchor'
      ),
      {
        hostname: 'www.ebay.co.uk',
        pathname: '/1/2',
        query: { q: '2', mpre: 'http://www.ebay.com' },
        hash: '#anchor',
      }
    );
  });

  it('returns a destination from a tracking url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        hostname: 'www.ebay.com',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX'
      ),
      {
        hostname: 'ebay.com',
        pathname: '/',
        query: {},
        hash: null,
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.co.uk%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        hostname: 'www.ebay.co.uk',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      hostname: null,
      pathname: null,
      query: {},
      hash: null,
    });
  });
});
