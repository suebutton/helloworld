const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/mileageplusx', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-7d9d3bea11ef3212',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-7d9d3bea11ef3212');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://mileageplusx.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'mileageplusx://?btn_ref=srctok-XXX',
          browser_link: null,
        }
      );
    });

    it('returns an app action for a url with a path', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://mileageplusx.com/hotels',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'mileageplusx://?btn_ref=srctok-XXX',
          browser_link: null,
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns no web action', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://mileageplusx.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: null,
        }
      );
    });
  });
});
