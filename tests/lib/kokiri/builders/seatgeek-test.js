const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/seatgeek', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-00eb446216ab549a',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-00eb446216ab549a');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'seatgeek://?btn_ref=srctok-XXX',
        browser_link: 'https://seatgeek.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032',
            query: {},
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?btn_ref=srctok-XXX',
          browser_link:
            'https://seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with query parameters', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname:
              '/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
          browser_link:
            'https://seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'srctok-XXX'),
        'https://track.bttn.io/seatgeek?btn_ref=srctok-XXX'
      );

      assert.deepEqual(
        this.builder.universalLink({ pathname: '/' }, 'srctok-XXX'),
        'https://track.bttn.io/seatgeek?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link with static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/seatgeek?btn_ref=org-XXX'
      );
    });

    it('returns a universal link with destination', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname:
              '/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032',
            query: {},
            hash: null,
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/seatgeek/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link with query parameters', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname:
              '/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032',
            query: {
              utm_campaign: 'BEST OIL',
            },
            hash: 'anchor',
          },
          'srctok-XXX'
        ),
        'https://track.bttn.io/seatgeek/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?utm_campaign=BEST%20OIL&btn_ref=srctok-XXX#anchor'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.seatgeek.com/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032?utm_campaign=BEST%20OIL'
      ),
      {
        pathname:
          '/real-madrid-c-f-vs-manchester-united-f-c-tickets/european-soccer/2017-07-23-2-pm/3817032',
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
