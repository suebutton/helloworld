const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const WARBYPARKER_ORG_ID = 'org-2fd15d5ed979b077';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';

describe('lib/kokiri/builders/warby-parker', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: WARBYPARKER_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: WARBYPARKER_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: WARBYPARKER_ORG_ID,
        default_value: 'Button',
        name: 'utm_campaign',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: SHOPKICK_ORG_ID,
        value: 'Shopkick',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', WARBYPARKER_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action on iOS', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'wp://app?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.warbyparker.com?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
      });
    });

    it('returns a browser link only app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: null,
        browser_link:
          'https://www.warbyparker.com?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
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
          app_link:
            'wp://app/sunglasses/women?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.warbyparker.com/sunglasses/women?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
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
            'wp://app/eyeglasses/men/durand/deep-sea-blue-fade?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.warbyparker.com/eyeglasses/men/durand/deep-sea-blue-fade?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
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
            'https://www.warbyparker.com/eyeglasses/men?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appAction({ pathname: '/bloop' }, 'ios', 'srctok-XXX'),
        {
          app_link:
            'wp://app/bloop?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.warbyparker.com/bloop?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        WARBYPARKER_ORG_ID
      );
      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'wp://app?utm_medium=affiliate&utm_source=Button&utm_campaign=Shopkick&btn_ref=srctok-XXX',
        browser_link:
          'https://www.warbyparker.com?utm_medium=affiliate&utm_source=Button&utm_campaign=Shopkick&btn_ref=srctok-XXX',
      });
    });

    it('overwrites incoming utm tokens and returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        WARBYPARKER_ORG_ID
      );
      assert.deepEqual(
        builder.appAction(
          {
            query: {
              utm_medium: 'pavel_affiliate',
              utm_source: 'pavel_source',
              utm_campaign: 'pavel_campaign',
            },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'wp://app?utm_medium=affiliate&utm_source=Button&utm_campaign=Shopkick&btn_ref=srctok-XXX',
          browser_link:
            'https://www.warbyparker.com?utm_medium=affiliate&utm_source=Button&utm_campaign=Shopkick&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action on iOS', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://warbyparker.bttn.io/app?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.warbyparker.com?utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
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
            'https://warbyparker.bttn.io/app/bloop?a=2&utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.warbyparker.com/bloop?a=2&utm_medium=affiliate&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        WARBYPARKER_ORG_ID
      );
      assert.deepEqual(builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://warbyparker.bttn.io/app?utm_medium=affiliate&utm_source=Button&utm_campaign=Shopkick&btn_ref=srctok-XXX',
        browser_link:
          'https://www.warbyparker.com?utm_medium=affiliate&utm_source=Button&utm_campaign=Shopkick&btn_ref=srctok-XXX',
      });
    });
  });
});
