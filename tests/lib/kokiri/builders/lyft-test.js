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
        app_link: 'lyft://?btn_ref=srctok-XXX',
        browser_link: null, //'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
      });
    });
    it('returns an app action for Android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'lyft://?btn_ref=srctok-XXX',
        browser_link: null, //'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
      });
    });
    it('returns an app action for standard lyft rides on iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: { id: 'lyft' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'lyft://ridetype?id=lyft&btn_ref=srctok-XXX',
          browser_link: null, //'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for standard lyft rides on Android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: { id: 'lyft' },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'lyft://ridetype?id=lyft&btn_ref=srctok-XXX',
          browser_link: null, //'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for premier lyft rides on iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: { id: 'lyft_premier' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: 'lyft://ridetype?id=lyft_premier&btn_ref=srctok-XXX',
          browser_link: null, //'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for plus lyft rides on Android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: { id: 'lyft_plus' },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'lyft://ridetype?id=lyft_plus&btn_ref=srctok-XXX',
          browser_link: null, //'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for standard lyft rides with pickup location on iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'pickup[latitude]': '37.777286',
              'pickup[longitude': '-122.398096',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'lyft://ridetype?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&btn_ref=srctok-XXX',
          browser_link: null, //'https://www.lyft.com/ride?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for standard lyft rides with pickup location on Android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'pickup[latitude]': '37.777286',
              'pickup[longitude': '-122.398096',
            },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'lyft://ridetype?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&btn_ref=srctok-XXX',
          browser_link: null, //'https://www.lyft.com/ride?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for standard lyft rides with destination location on iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'destination[latitude]': '37.795923',
              'destination[longitude': '-122.392052',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'lyft://ridetype?id=lyft&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
          browser_link: null, //'https://www.lyft.com/ride?id=lyft&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for standard lyft rides with destination location on Android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'destination[latitude]': '37.795923',
              'destination[longitude': '-122.392052',
            },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'lyft://ridetype?id=lyft&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
          browser_link: null, //'https://www.lyft.com/ride?id=lyft&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for standard lyft rides with pickup location & destination location on iOS', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'pickup[latitude]': '37.777286',
              'pickup[longitude': '-122.398096',
              'destination[latitude]': '37.795923',
              'destination[longitude': '-122.392052',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'lyft://ridetype?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
          browser_link: null, //'https://www.lyft.com/ride?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for standard lyft rides with pickup location & destination location on Android', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'pickup[latitude]': '37.777286',
              'pickup[longitude': '-122.398096',
              'destination[latitude]': '37.795923',
              'destination[longitude': '-122.392052',
            },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'lyft://ridetype?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
        }
      );
    });
  });
  describe('#webAction', function() {
    it('returns a web action for iOS', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null, // 'https://lyft.bttn.io?btn_ref=srctok-XXX',
        browser_link: null, // 'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
      });
    });
    it('returns a web action for Android', function() {
      assert.deepEqual(this.builder.webAction({}, 'android', 'srctok-XXX'), {
        app_link: null, // 'https://lyft.bttn.io?btn_ref=srctok-XXX',
        browser_link: null, // 'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
      });
    });
    it('returns a web action for standard lyft rides for iOS', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: { id: 'lyft' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for standard lyft rides for Android', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: { id: 'lyft' },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for XL lyft rides on iOS', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: { id: 'lyft_xl' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft_xl&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for XL lyft rides on Android', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: { id: 'lyft_xl' },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft_xl&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for standard lyft rides with pickup location on iOS', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'pickup[latitude]': '37.777286',
              'pickup[longitude': '-122.398096',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for standard lyft rides with pickup location on Android', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'pickup[latitude]': '37.777286',
              'pickup[longitude': '-122.398096',
            },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for standard lyft rides with destination location on iOS', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'destination[latitude]': '37.795923',
              'destination[longitude': '-122.392052',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for standard lyft rides with destination location on Android', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'destination[latitude]': '37.795923',
              'destination[longitude': '-122.392052',
            },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for standard lyft rides with pickup location & destination location on iOS', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'pickup[latitude]': '37.777286',
              'pickup[longitude': '-122.398096',
              'destination[latitude]': '37.795923',
              'destination[longitude': '-122.392052',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns a web action for standard lyft rides with pickup location & destination location on Android', function() {
      assert.deepEqual(
        this.builder.webAction(
          {
            pathname: '/ride',
            query: {
              id: 'lyft',
              'pickup[latitude]': '37.777286',
              'pickup[longitude': '-122.398096',
              'destination[latitude]': '37.795923',
              'destination[longitude': '-122.392052',
            },
            hash: null,
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null, // 'https://lyft.bttn.io/ridetype?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
          browser_link: null, // 'https://www.lyft.com/ride?id=lyft&pickup%5Blatitude%5D=37.777286&pickup%5Blongitude=-122.398096&destination%5Blatitude%5D=37.795923&destination%5Blongitude=-122.392052&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
