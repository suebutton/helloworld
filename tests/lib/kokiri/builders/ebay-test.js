const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/ebay', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-5d63b849c1d24db2',
      },
      {
        status: 'approved',
        audience: 'org-030575eddb72b4df',
        organization: 'org-5d63b849c1d24db2',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);
    this.builder = this.config.createBuilder('org-XXX', 'org-5d63b849c1d24db2');
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
      const builder = this.config.createBuilder(
        'org-030575eddb72b4df',
        'org-5d63b849c1d24db2'
      );
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
        app_link:
          'https://ebay.bttn.io/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_refkey=customid&btn_ref=srctok-XXX',
        browser_link:
          'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
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
            'https://ebay.bttn.io/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fbloop%3Fa%3D2&btn_refkey=customid&btn_ref=srctok-XXX',
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
        app_link:
          'https://ebay.bttn.io/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_refkey=customid&btn_ref=srctok-XXX',
        browser_link:
          'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
        'https://track.bttn.io/ebay/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_refkey=customid&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/ebay/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=org-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_refkey=customid&btn_ref=org-XXX'
      );
    });

    it('returns a universal link with a destination', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/bloop/2',
            query: { a: true },
            hash: 'anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/ebay/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fbloop%2F2%3Fa%3Dtrue%23anchor&btn_refkey=customid&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link overriding affiliation paremeters', function() {
      assert.deepEqual(
        this.builder.universalLink(
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
        'https://track.bttn.io/ebay/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_refkey=customid&btn_ref=srctok-XXX'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://ebay.com/1/2?q=2&mpre=http%3A%2F%2Fwww.ebay.com#anchor'
      ),
      {
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
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      pathname: null,
      query: {},
      hash: null,
    });
  });
});
