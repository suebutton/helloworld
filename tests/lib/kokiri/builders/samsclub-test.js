const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/samsclub', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-038ecf7c962b91d1',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-038ecf7c962b91d1');
  });

  describe('#appAction', function() {
    it('returns no app action on ios', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link: 'https://m.samsclub.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'https://app.samsclub.com/home?btn_ref=srctok-XXX',
        browser_link: 'https://m.samsclub.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'android', 'srctok-XXX'),
        {
          app_link: null,
          browser_link: 'https://m.samsclub.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns no app action for category on ios', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/sams/glimmer-shimmer-unicorn-toys/4567.cp',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://m.samsclub.com/sams/glimmer-shimmer-unicorn-toys/4567.cp?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for category on android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/sams/easy-office-plants/1010.cp',
            query: {},
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://app.samsclub.com/category?id=1010&btn_ref=srctok-XXX',
          browser_link:
            'https://m.samsclub.com/sams/easy-office-plants/1010.cp?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link: 'https://m.samsclub.com?btn_ref=srctok-XXX',
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
          browser_link: 'https://m.samsclub.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
