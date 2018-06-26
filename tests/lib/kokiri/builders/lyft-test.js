const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/lyft', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-5ee4b6c77217fd5f',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-5ee4b6c77217fd5f');
  });

  describe('#appAction', function() {
    it('returns an app action for iOS', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'lyft://button?btn_ref=srctok-XXX',
        browser_link: null,
      });
    });
    it('returns an app action for Android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'lyft://button?btn_ref=srctok-XXX',
        browser_link: null,
      });
    });
  });

  describe('#webAction', function() {
    it('returns a web action for iOS', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://lyft.bttn.io/button?btn_ref=srctok-XXX',
        browser_link: null,
      });
    });

    it('returns a web action for Android', function() {
      assert.deepEqual(this.builder.webAction({}, 'android', 'srctok-XXX'), {
        app_link: 'https://lyft.bttn.io/button?btn_ref=srctok-XXX',
        browser_link: null,
      });
    });
  });
});
