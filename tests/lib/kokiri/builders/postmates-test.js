const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/postmates', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-50789c5890cd1b37',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-50789c5890cd1b37');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://postmates.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'postmates://?pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://postmates.com?pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a homepage app action for android', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://postmates.com',
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'postmates://v1?pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://postmates.com?pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a homepage app action for android with a specified path', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://postmates.com/category/coffee',
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'postmates://v1?pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://postmates.com?pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a homepage app action for ios for a specified path', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://postmates.com/bloop',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'postmates://?pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://postmates.com?pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://postmates.com?pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
      });
    });

    it('rewrites a web action with destination to homepage', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://postmates.com?a=2&pid=button_int&c=button_aff_aff_button_all_all_cpa_all_all&is_retargeting=TRUE&af_siteid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
