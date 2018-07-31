const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/warby-parker', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-2fd15d5ed979b077',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-2fd15d5ed979b077');
  });

  describe('#appAction', function() {
    it('returns an app action on iOS', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'wp://app?btn_ref=srctok-XXX',
        browser_link: 'https://www.warbyparker.com?btn_ref=srctok-XXX',
      });
    });

    it('returns a browser link only app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: null,
        browser_link: 'https://www.warbyparker.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for the women sunglasses category on iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/sunglasses/women' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'wp://app/sunglasses/women?btn_ref=srctok-XXX',
          browser_link:
            'https://www.warbyparker.com/sunglasses/women?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for specific men eyeglasses on iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/eyeglasses/men/durand/deep-sea-blue-fade' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'wp://app/eyeglasses/men/durand/deep-sea-blue-fade?btn_ref=srctok-XXX',
          browser_link:
            'https://www.warbyparker.com/eyeglasses/men/durand/deep-sea-blue-fade?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a browser link only app action for the men eyeglasses category on android', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/eyeglasses/men' },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.warbyparker.com/eyeglasses/men?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link: 'wp://app/bloop?btn_ref=srctok-XXX',
          browser_link: 'https://www.warbyparker.com/bloop?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action on iOS', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'https://warbyparker.bttn.io/app?btn_ref=srctok-XXX',
        browser_link: 'https://www.warbyparker.com?btn_ref=srctok-XXX',
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
          app_link:
            'https://warbyparker.bttn.io/app/bloop?a=2&btn_ref=srctok-XXX',
          browser_link:
            'https://www.warbyparker.com/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.warbyparker.com/bloop?utm_campaign=BEST%20OIL'
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
