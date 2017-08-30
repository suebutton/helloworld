const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/generic', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-1234',
      },
    ];

    const webToAppMappings = [
      {
        organization: 'org-1234',
        subdomain_name: 'bloop',
        external_host: 'https://bloop.com',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], webToAppMappings, approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-1234');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://www.bloop.com?btn_ref=srctok-XXX',
        browser_link: 'https://www.bloop.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an universal link action', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/some/resy/action',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'https://www.bloop.com/some/resy/action?btn_ref=srctok-XXX',
          browser_link:
            'https://www.bloop.com/some/resy/action?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://bloop.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.bloop.com?btn_ref=srctok-XXX',
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
          app_link: 'https://bloop.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link: 'https://www.bloop.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
        'https://track.bttn.io/bloop?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/bloop?btn_ref=org-XXX'
      );
    });

    it('returns a universal link for a hotel', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/some/resy/action',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/bloop/some/resy/action?btn_ref=srctok-XXX'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.bloop.com/some/resy/action?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/some/resy/action',
        query: { utm_campaign: 'BEST OIL' },
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
