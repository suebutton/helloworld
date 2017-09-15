const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/hoteltonight', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-36fe49ce9ccb9116',
      },
      {
        status: 'approved',
        audience: 'org-2d432a88b9bb8bda',
        organization: 'org-36fe49ce9ccb9116',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-36fe49ce9ccb9116');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'hoteltonight://?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'hoteltonight://open?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for non-app paths', function() {
      assert.deepEqual(
        this.builder.appAction(
          { pathname: '/bloop', query: { utm_campaign: 'bleep', q: 2 } },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://www.hoteltonight.com/bloop?utm_campaign=Button&q=2&adjust_tracker=z5iwhj&utm_source=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for Ibotta', function() {
      const builder = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-36fe49ce9ccb9116'
      );

      assert.deepEqual(builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'hoteltonight://?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button_Ibotta&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button_Ibotta&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for Ibotta Android', function() {
      const builder = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-36fe49ce9ccb9116'
      );

      assert.deepEqual(builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'hoteltonight://open?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button_Ibotta&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button_Ibotta&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://hoteltonight.bttn.io?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
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
            'https://hoteltonight.bttn.io/bloop?a=2&adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hoteltonight.com/bloop?a=2&adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action protecting affiliation parameters', function() {
      const query = {
        adjust_tracker: 'pavel',
        utm_source: 'pavel',
        utm_campaign: 'pavel',
      };

      assert.deepEqual(this.builder.webAction({ query }, 'ios', 'srctok-XXX'), {
        app_link:
          'https://hoteltonight.bttn.io?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
        browser_link:
          'https://www.hoteltonight.com?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX',
      });
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
        'https://track.bttn.io/hoteltonight?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/hoteltonight?adjust_tracker=z5iwhj&utm_source=Button&utm_campaign=Button&btn_ref=org-XXX'
      );
    });

    it('returns a universal link for a path', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/bloop',
            query: { utm_campaign: 'bleep', q: 2 },
            hash: '#sleep',
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/hoteltonight/bloop?utm_campaign=Button&q=2&adjust_tracker=z5iwhj&utm_source=Button&btn_ref=srctok-XXX#sleep'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://hoteltonight.com/bloop?utm_campaign=BESTSLEEP#sleep'
      ),
      {
        pathname: '/bloop',
        query: { utm_campaign: 'BESTSLEEP' },
        hash: '#sleep',
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      pathname: null,
      query: {},
      hash: null,
    });
  });
});
