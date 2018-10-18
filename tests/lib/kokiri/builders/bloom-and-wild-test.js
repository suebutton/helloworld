const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/bloom-and-wild', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-2705011eae8616ea',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-2705011eae8616ea');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'bloom://?btn_ref=srctok-XXX',
        browser_link: 'https://www.bloomandwild.com?btn_ref=srctok-XXX',
      });
    });

    it('return an app action for non-app-supported pathnames', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bleep' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link: 'https://www.bloomandwild.com/bleep?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://bloomandwild.bttn.io?btn_ref=srctok-XXX',
        browser_link: 'https://www.bloomandwild.com?btn_ref=srctok-XXX',
      });
    });
  });
});
