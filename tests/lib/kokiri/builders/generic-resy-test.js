const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/rest-generic', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-273ae234ce730ab5',
      },
    ];

    const webToAppMappings = [
      {
        organization: 'org-273ae234ce730ab5',
        subdomain_name: 'resy',
        external_host: 'https://resy.com',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], webToAppMappings, approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-273ae234ce730ab5');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://www.resy.com?btn_ref=srctok-XXX',
        browser_link: 'https://www.resy.com?btn_ref=srctok-XXX',
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
          app_link: 'https://www.resy.com/some/resy/action?btn_ref=srctok-XXX',
          browser_link:
            'https://www.resy.com/some/resy/action?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'srctok-XXX'),
        'https://track.bttn.io/resy?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/resy?btn_ref=org-XXX'
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
          'srctok-XXX'
        ),
        'https://track.bttn.io/resy/some/resy/action?btn_ref=srctok-XXX'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.resy.com/some/resy/action?utm_campaign=BEST%20OIL'
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
