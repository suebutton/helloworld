const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const GROUPON_ORG_ID = 'org-681847bf6cc4d57c';
const QUIDCO_ORG_ID = 'org-294d8a7f8adbd98f';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';
const PURCH_ORG_ID = 'org-1443446d6738e5bc';

describe('lib/kokiri/builders/groupon', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: GROUPON_ORG_ID,
      },
      {
        status: 'approved',
        audience: QUIDCO_ORG_ID,
        organization: GROUPON_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: GROUPON_ORG_ID,
      },
      {
        status: 'approved',
        audience: PURCH_ORG_ID,
        organization: GROUPON_ORG_ID,
      },
    ];

    const webToAppMappings = [
      {
        organization: GROUPON_ORG_ID,
        subdomain_name: 'groupon-uk',
        external_host: 'https://groupon.co.uk',
      },
      {
        organization: GROUPON_ORG_ID,
        subdomain_name: 'groupon-au',
        external_host: 'https://groupon.com.au',
      },
      {
        organization: GROUPON_ORG_ID,
        subdomain_name: 'groupon',
        external_host: 'https://www.groupon.com',
      },
    ];

    const partnerParameters = [
      {
        id: '123',
        organization: GROUPON_ORG_ID,
        default_value: '204629',
        name: 'utm-campaign',
      },
      {
        id: '456',
        organization: GROUPON_ORG_ID,
        default_value: null,
        name: 'wid',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '123',
        organization: QUIDCO_ORG_ID,
        value: '211215',
      },
      {
        partner_parameter: '123',
        organization: IBOTTA_ORG_ID,
        value: '206994',
      },
      {
        partner_parameter: '456',
        organization: PURCH_ORG_ID,
        value: 'https://www.shopsavvy.com/',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      webToAppMappings,
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', GROUPON_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'groupon:///dispatch/us?utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for deals', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/deals/pavel-kitty-house',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us/deal/pavel-kitty-house?utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fdeals%2Fpavel-kitty-house&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/deal/pavel-kitty-house',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us/deal/pavel-kitty-house?utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fdeal%2Fpavel-kitty-house&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/deal/pavel-kitty-house',
            hostname: 'groupon.co.uk',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/uk/deal/pavel-kitty-house?utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=531&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://t.groupon.co.uk/r?tsToken=UK_AFF_0_204629_531_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%2Fdeal%2Fpavel-kitty-house&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for channel links', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/getaways' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'groupon:///dispatch/us/channel/getaways?utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fgetaways&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction({ pathname: '/goods' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'groupon:///dispatch/us/channel/goods?utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fgoods&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/goods/baby' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fgoods%2Fbaby&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for browse links', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/browse/pavel-kitty-house',
            query: { category: 'personal-services', category2: 'photography' },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us/search?category=personal-services&category2=photography&utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbrowse%2Fpavel-kitty-house%3Fcategory%3Dpersonal-services%26category2%3Dphotography&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/browse',
            query: { category: 'personal-services' },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us/search?category=personal-services&utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbrowse%3Fcategory%3Dpersonal-services&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/browse/',
            query: { category: 'personal-services', category2: 'photography' },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us/search?category=personal-services&category2=photography&utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbrowse%3Fcategory%3Dpersonal-services%26category2%3Dphotography&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              utm_medium: 'pavel',
              utm_source: 'pavel',
              utm_campaign: 'pavel',
              mediaId: 'pavel',
              sid: 'dabral',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us?utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action where hostname is unknown', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'pavel',
            pathname: '',
            query: { a: true },
            hash: 'anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us?a=true&utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX#anchor',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%3Fa%3Dtrue%23anchor&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action when hostname is not US', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'groupon.co.uk',
            pathname: '',
            query: { a: true },
            hash: 'anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/uk?a=true&utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=531&sid=srctok-XXX&btn_ref=srctok-XXX#anchor',
          browser_link:
            'https://t.groupon.co.uk/r?tsToken=UK_AFF_0_204629_531_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%3Fa%3Dtrue%23anchor&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'groupon.fr',
            pathname: '',
            query: { a: true },
            hash: 'anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/fr?a=true&utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=512&sid=srctok-XXX&btn_ref=srctok-XXX#anchor',
          browser_link:
            'https://t.groupon.fr/r?tsToken=FR_AFF_0_204629_512_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.fr%3Fa%3Dtrue%23anchor&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            hostname: 'grouponnz.co.nz',
            pathname: '',
            query: { a: true },
            hash: 'anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/nz?a=true&utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=521&sid=srctok-XXX&btn_ref=srctok-XXX#anchor',
          browser_link:
            'https://t.grouponnz.co.nz/r?tsToken=NZ_AFF_0_204629_521_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.grouponnz.co.nz%3Fa%3Dtrue%23anchor&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with a wid', function() {
      const builder = this.config.createBuilder(PURCH_ORG_ID, GROUPON_ORG_ID);

      assert.deepEqual(
        builder.appAction({ query: { wid: 'pavel' } }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'groupon:///dispatch/us?wid=https%3A%2F%2Fwww.shopsavvy.com%2F&utm_medium=afl&utm_source=GPN&utm_campaign=204629&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&wid=https%3A%2F%2Fwww.shopsavvy.com%2F&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for Ibotta', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, GROUPON_ORG_ID);

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'groupon:///dispatch/us?utm_medium=afl&utm_source=GPN&utm_campaign=206994&mediaId=500&sid=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for Quidco', function() {
      const builder = this.config.createBuilder(QUIDCO_ORG_ID, GROUPON_ORG_ID);

      assert.deepEqual(
        builder.appAction({ hostname: 'groupon.co.uk' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'groupon:///dispatch/uk?utm_medium=afl&utm_source=GPN&utm_campaign=211215&mediaId=531&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://t.groupon.co.uk/r?tsToken=UK_AFF_0_211215_531_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_ref=srctok-XXX',
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
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbloop%3Fa%3D2&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with a wid', function() {
      const builder = this.config.createBuilder(PURCH_ORG_ID, GROUPON_ORG_ID);

      assert.deepEqual(
        builder.webAction({ query: { wid: 'pavel' } }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&wid=https%3A%2F%2Fwww.shopsavvy.com%2F&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with a non-US hostname', function() {
      assert.deepEqual(
        this.builder.webAction(
          { hostname: 'groupon.co.uk' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://t.groupon.co.uk/r?tsToken=UK_AFF_0_204629_531_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk&btn_ref=srctok-XXX',
        }
      );
      assert.deepEqual(
        this.builder.webAction(
          { hostname: 'groupon.pl' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://t.groupon.pl/r?tsToken=PL_AFF_0_204629_524_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.pl&btn_ref=srctok-XXX',
        }
      );
      assert.deepEqual(
        this.builder.webAction({ hostname: 'groupon.fr' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://t.groupon.fr/r?tsToken=FR_AFF_0_204629_512_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.fr&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with an unknown hostname', function() {
      assert.deepEqual(
        this.builder.webAction(
          { hostname: 'groupon.pavel' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action protecting affiliation parameters', function() {
      const query = {
        utm_medium: 'pavel',
        utm_source: 'pavel',
        utm_campaign: 'pavel',
        mediaId: 'pavel',
        sid: 'dabral',
      };

      assert.deepEqual(
        this.builder.webAction(
          { hostname: 'groupon.pavel', query },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_204629_500_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon.com/1/2?q=2&url=https%3A%2F%2Fwww.groupon.co.uk#anchor'
      ),
      {
        hostname: 'groupon.com',
        pathname: '/1/2',
        query: { q: '2', url: 'https://www.groupon.co.uk' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon.co.uk/1/2?q=2&url=https%3A%2F%2Fwww.groupon.co.uk#anchor'
      ),
      {
        hostname: 'groupon.co.uk',
        pathname: '/1/2',
        query: { q: '2', url: 'https://www.groupon.co.uk' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon.fr/1/2?q=2&url=https%3A%2F%2Fwww.groupon.fr#anchor'
      ),
      {
        hostname: 'groupon.fr',
        pathname: '/1/2',
        query: { q: '2', url: 'https://www.groupon.fr' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.groupon.co.uk/1/2?q=2&url=https%3A%2F%2Fwww.groupon.co.uk#anchor'
      ),
      {
        hostname: 'groupon.co.uk',
        pathname: '/1/2',
        query: { q: '2', url: 'https://www.groupon.co.uk' },
        hash: '#anchor',
      }
    );
  });

  it('returns a destination from a bttnio url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl('https://groupon.bttn.io/1/2?q=2#anchor'),
      {
        hostname: 'groupon.com',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl('https://groupon.bttn.io/1/2?q=2#anchor'),
      {
        hostname: 'groupon.com',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://track.bttn.io/groupon/1/2?q=2#anchor'
      ),
      {
        hostname: 'groupon.com',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon-uk.bttn.io/1/2?q=2#anchor'
      ),
      {
        hostname: 'groupon.co.uk',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon-au.bttn.io/1/2?q=2#anchor'
      ),
      {
        hostname: 'groupon.com.au',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon-uk.bttn.io/1/2?q=2#anchor'
      ),
      {
        hostname: 'groupon.co.uk',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://track.bttn.io/groupon-uk/1/2?q=2#anchor'
      ),
      {
        hostname: 'groupon.co.uk',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );
  });

  it('returns a destination from a tracking url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://t.groupon.co.uk/r?tsToken=UK_AFF_0_209099_531_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        hostname: 'groupon.co.uk',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://t.groupon.com.au/r?tsToken=AU_AFF_0_209099_533_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com.au%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        hostname: 'groupon.com.au',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://t.groupon.fr/r?tsToken=FR_AFF_0_209099_512_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.fr%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        hostname: 'groupon.fr',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://tracking.groupon.com/r?tsToken=UK_AFF_0_209099_531_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        hostname: 'groupon.com',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.tracking.groupon.com/r?tsToken=UK_AFF_0_209099_531_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        hostname: 'groupon.com',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      pathname: null,
      query: {},
      hash: null,
      hostname: '',
    });
  });
});
