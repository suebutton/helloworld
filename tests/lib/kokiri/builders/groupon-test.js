const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/groupon', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-681847bf6cc4d57c',
      },
      {
        status: 'approved',
        audience: 'org-294d8a7f8adbd98f',
        organization: 'org-681847bf6cc4d57c',
      },
      {
        status: 'approved',
        audience: 'org-2d432a88b9bb8bda',
        organization: 'org-681847bf6cc4d57c',
      },
    ];

    const webToAppMappings = [
      {
        organization: 'org-681847bf6cc4d57c',
        subdomain_name: 'groupon-uk',
        external_host: 'https://groupon.co.uk',
      },
      {
        organization: 'org-681847bf6cc4d57c',
        subdomain_name: 'groupon',
        external_host: 'https://www.groupon.com',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], webToAppMappings, approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-681847bf6cc4d57c');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'groupon:///dispatch/us?utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_ref=srctok-XXX',
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
            'groupon:///dispatch/us/deal/pavel-kitty-house?utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fdeals%2Fpavel-kitty-house&btn_ref=srctok-XXX',
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
            'groupon:///dispatch/us/deal/pavel-kitty-house?utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fdeal%2Fpavel-kitty-house&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: 'deal/pavel-kitty-house',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us/deal/pavel-kitty-house?utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fdeal%2Fpavel-kitty-house&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: 'deal/pavel-kitty-house',
            region: 'uk',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/uk/deal/pavel-kitty-house?utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://t.groupon.co.uk/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%2Fdeal%2Fpavel-kitty-house&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for browse links', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: 'browse/pavel-kitty-house',
            query: { category: 'personal-services', category2: 'photography' },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us/search?category=personal-services&category2=photography&utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbrowse%2Fpavel-kitty-house%3Fcategory%3Dpersonal-services%26category2%3Dphotography&btn_ref=srctok-XXX',
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
            'groupon:///dispatch/us/search?category=personal-services&utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbrowse%3Fcategory%3Dpersonal-services&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: 'browse/',
            query: { category: 'personal-services', category2: 'photography' },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us/search?category=personal-services&category2=photography&utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbrowse%3Fcategory%3Dpersonal-services%26category2%3Dphotography&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action overriding affiliation paremeters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            query: {
              utm_medium: 'pavel',
              utm_source: 'pavel',
              utm_campaign: 'pavel',
              sid: 'dabral',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/us?utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action where region is unknown', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '',
            query: { a: true },
            hash: 'anchor',
            region: 'pavel',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/pavel?a=true&utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX#anchor',
          browser_link:
            'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%3Fa%3Dtrue%23anchor&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action when region is UK', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '',
            query: { a: true },
            hash: 'anchor',
            region: 'uk',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'groupon:///dispatch/uk?a=true&utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX#anchor',
          browser_link:
            'https://t.groupon.co.uk/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%3Fa%3Dtrue%23anchor&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for Ibotta', function() {
      const builder = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-681847bf6cc4d57c'
      );

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'groupon:///dispatch/us?utm_medium=afl&utm_source=GPN&utm_campaign=206994&sid=srctok-XXX&btn_ref=srctok-XXX',
        browser_link:
          'https://tracking.groupon.com/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for Quidco', function() {
      const builder = this.config.createBuilder(
        'org-294d8a7f8adbd98f',
        'org-681847bf6cc4d57c'
      );

      assert.deepEqual(
        builder.appAction({ region: 'uk' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'groupon:///dispatch/uk?utm_medium=afl&utm_source=GPN&utm_campaign=211215&sid=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://t.groupon.co.uk/r?tsToken=UK_AFF_0_211215_1219277_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
        'https://track.bttn.io/groupon-tracking/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_refkey=sid&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/groupon-tracking/r?tsToken=US_AFF_0_206994_1652352_0&sid=org-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_refkey=sid&btn_ref=org-XXX'
      );
    });

    it('returns a universal link with a destination', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: 'bloop/2',
            query: { a: true },
            hash: 'anchor',
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/groupon-tracking/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbloop%2F2%3Fa%3Dtrue%23anchor&btn_refkey=sid&btn_ref=srctok-XXX'
      );

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
        'https://track.bttn.io/groupon-tracking/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbloop%2F2%3Fa%3Dtrue%23anchor&btn_refkey=sid&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link overriding affiliation paremeters', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            query: {
              utm_medium: 'pavel',
              utm_source: 'pavel',
              utm_campaign: 'pavel',
              sid: 'dabral',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/groupon-tracking/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com&btn_refkey=sid&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link where region is unknown', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: 'bloop/2',
            query: { a: true },
            hash: 'anchor',
            region: 'pavel',
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/groupon-tracking/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.com%2Fbloop%2F2%3Fa%3Dtrue%23anchor&btn_refkey=sid&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link when region is UK', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: 'bloop/2',
            query: { a: true },
            hash: 'anchor',
            region: 'uk',
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/groupon-uk-tracking/r?tsToken=US_AFF_0_206994_1652352_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%2Fbloop%2F2%3Fa%3Dtrue%23anchor&btn_refkey=sid&btn_ref=srctok-XXX'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon.com/1/2?q=2&url=https%3A%2F%2Fwww.groupon.co.uk#anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2', url: 'https://www.groupon.co.uk' },
        hash: '#anchor',
        region: 'us',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon.co.uk/1/2?q=2&url=https%3A%2F%2Fwww.groupon.co.uk#anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2', url: 'https://www.groupon.co.uk' },
        hash: '#anchor',
        region: 'uk',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.groupon.co.uk/1/2?q=2&url=https%3A%2F%2Fwww.groupon.co.uk#anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2', url: 'https://www.groupon.co.uk' },
        hash: '#anchor',
        region: 'uk',
      }
    );
  });

  it('returns a destination from a bttnio url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl('https://groupon.bttn.io/1/2?q=2#anchor'),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
        region: 'us',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl('https://groupon.bttn.io/1/2?q=2#anchor'),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
        region: 'us',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://track.bttn.io/groupon/1/2?q=2#anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
        region: 'us',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon-uk.bttn.io/1/2?q=2#anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
        region: 'uk',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://groupon-uk.bttn.io/1/2?q=2#anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
        region: 'uk',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://track.bttn.io/groupon-uk/1/2?q=2#anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
        region: 'uk',
      }
    );
  });

  it('returns a destination from a tracking url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://t.groupon.co.uk/r?tsToken=UK_AFF_0_209099_1113315_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
        region: 'uk',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://tracking.groupon.com/r?tsToken=UK_AFF_0_209099_1113315_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
        region: 'us',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.tracking.groupon.com/r?tsToken=UK_AFF_0_209099_1113315_0&sid=srctok-XXX&url=https%3A%2F%2Fwww.groupon.co.uk%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
        region: 'us',
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      pathname: null,
      query: {},
      hash: null,
      region: 'us',
    });
  });

  it('returns a region-specific bttnio subdomain', function() {
    assert.deepEqual(
      this.builder.getPartnerSubdomain({ region: 'us' }),
      'groupon-tracking'
    );

    assert.deepEqual(
      this.builder.getPartnerSubdomain({ region: 'uk' }),
      'groupon-uk-tracking'
    );

    assert.deepEqual(
      this.builder.getPartnerSubdomain({ region: 'pavel' }),
      'groupon-tracking'
    );

    assert.deepEqual(this.builder.getPartnerSubdomain({}), 'groupon-tracking');
  });
});
