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
        organization: 'org-22e0c0464157d00d',
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
          .appAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://goto.target.com/c/415484/81938/2092?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-2ef55bcceba936bf')
          .appAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://kohls.sjv.io/c/415484/362118/5349?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-22e0c0464157d00d')
          .appAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://mvmt.7eer.net/c/415484/222268/3856?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-3bec3b5c0cac44ad')
          .appAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-03418dec42db44bc')
          .appAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://hpn.houzz.com/c/415484/372747/5454?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-7829938c0c640b81')
          .appAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-24621b367f4280bc')
          .webAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://goto.target.com/c/415484/81938/2092?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-2ef55bcceba936bf')
          .webAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://kohls.sjv.io/c/415484/362118/5349?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-22e0c0464157d00d')
          .webAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://mvmt.7eer.net/c/415484/222268/3856?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-3bec3b5c0cac44ad')
          .webAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-03418dec42db44bc')
          .webAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://hpn.houzz.com/c/415484/372747/5454?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-7829938c0c640b81')
          .webAction({ url: 'https://merchant.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fmerchant.com&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('destinationFromUrl', function() {
    it('returns a destination from a url', function() {
      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-7829938c0c640b81')
          .destinationFromUrl('https://www.target.com/iphone-7'),
        {
          url: 'https://www.target.com/iphone-7',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', 'org-7829938c0c640b81')
          .destinationFromUrl(''),
        {
          url: '',
        }
      );
    });
  });
});
