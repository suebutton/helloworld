const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/impact-radius', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-24621b367f4280bc',
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-2ef55bcceba936bf',
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-4c5c4337f5359c9f',
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-3bec3b5c0cac44ad',
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-03418dec42db44bc',
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-7829938c0c640b81',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });
  });

  describe('#appAction', function() {
    it('returns an app action for each merchant', function() {
      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-24621b367f4280bc')
          .appAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://goto.target.com/c/415484/81938/2092?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-2ef55bcceba936bf')
          .appAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://kohls.sjv.io/c/415484/362118/5349?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-4c5c4337f5359c9f')
          .appAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://janecom.7eer.net/c/415484/136645/2703?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-3bec3b5c0cac44ad')
          .appAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-03418dec42db44bc')
          .appAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://hpn.houzz.com/c/415484/372747/5454?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-7829938c0c640b81')
          .appAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-24621b367f4280bc')
          .webAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://goto.target.com/c/415484/81938/2092?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-2ef55bcceba936bf')
          .webAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://kohls.sjv.io/c/415484/362118/5349?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-4c5c4337f5359c9f')
          .webAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://janecom.7eer.net/c/415484/136645/2703?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-3bec3b5c0cac44ad')
          .webAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-03418dec42db44bc')
          .webAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://hpn.houzz.com/c/415484/372747/5454?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-7829938c0c640b81')
          .webAction({}, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
