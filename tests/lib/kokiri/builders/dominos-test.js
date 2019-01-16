const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/dominos', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-7497aa6bd6d1ffa0',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-7497aa6bd6d1ffa0');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.dominos.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'dominos://?btn_ref=srctok-XXX',
          browser_link: 'https://www.dominos.com/en?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for android', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.dominos.com',
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'dominos://?btn_ref=srctok-XXX',
          browser_link: 'https://www.dominos.com/en?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.dominos.com/bloop',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: 'https://www.dominos.com/en/bloop?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.dominos.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'https://dominos.bttn.io?btn_ref=srctok-XXX',
          browser_link: 'https://www.dominos.com/en?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.dominos.com/bloop?a=2',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'https://dominos.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link:
            'https://www.dominos.com/en/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
