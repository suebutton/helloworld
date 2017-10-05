const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/resy', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-273ae234ce730ab5',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-273ae234ce730ab5');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'resy://resy.com?btn_ref=srctok-XXX',
        browser_link: 'https://www.resy.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'resy://resy.com?btn_ref=srctok-XXX',
        browser_link: 'https://www.resy.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link: 'https://www.resy.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://resy.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.resy.com?btn_ref=srctok-XXX',
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
          app_link: 'https://resy.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link: 'https://www.resy.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.resy.com/bloop?utm_campaign=BEST%20OIL'
      ),
      {
        pathname: '/bloop',
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
