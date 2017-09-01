const assert = require('assert');
const { omit } = require('lodash');

const sinon = require('sinon');

const { mochaAsync } = require('../helpers');

const KokiriAdapter = require('../../lib/kokiri-adapter');

describe('/lib/kokiri/kokiri-adapter', function() {
  beforeEach(function() {
    this.metrics = {
      increment: sinon.spy(),
    };

    this.bigqueryLogger = {
      scheduleInsert: sinon.spy(),
    };

    const approvals = new Map([
      [
        'a',
        {
          status: 'approved',
          audience: 'org-XXX',
          organization: 'org-3573c6b896624279',
        },
      ],
      [
        'b',
        {
          status: 'approved',
          audience: 'org-XXX',
          organization: 'org-3573c6b896624279',
        },
      ],
    ]);

    const webToAppMappings = new Map([
      [
        'a',
        {
          subdomain_name: 'bloop',
          organization: 'org-3573c6b896624279',
          external_host: 'https://hotels.com',
        },
      ],
      [
        'b',
        {
          subdomain_name: 'bloop-tracking',
          organization: 'org-3573c6b896624279',
          external_host: 'https://t.hotels.com',
        },
      ],
    ]);

    this.clientStore = {
      approvals,
      webToAppMappings,
    };

    this.kokiriAdapter = new KokiriAdapter(
      this.metrics,
      this.clientStore,
      this.bigqueryLogger
    );
  });

  describe('#maybeRedirect', function() {
    beforeEach(function() {
      this.redis = {
        getSet: sinon.spy(() => Promise.resolve('http://redirect.biz')),
      };
    });

    it(
      'returns information when no redirect is needed',
      mochaAsync(async function() {
        const result = await this.kokiriAdapter.maybeRedirect(
          this.redis,
          'http://groupon.com/bloop'
        );

        // TODO(will): this `affiliate` match is wrong
        assert.deepEqual(result, {
          affiliate: {
            display_name: 'Groupon',
            hostname: 'groupon.com',
            query_url_keys: [],
          },
          shouldRedirect: false,
          targetUrl: 'http://groupon.com/bloop',
        });

        assert.equal(this.metrics.increment.callCount, 0);
      })
    );

    it(
      'redirects and returns information when needed',
      mochaAsync(async function() {
        const result = await this.kokiriAdapter.maybeRedirect(
          this.redis,
          'http://groupon.com/coupons/click/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
        );

        assert.deepEqual(result, {
          affiliate: {
            display_name: 'Groupon',
            hostname: 'groupon.com',
            query_url_keys: [],
          },
          shouldRedirect: true,
          targetUrl: 'http://redirect.biz',
        });

        assert.equal(this.metrics.increment.callCount, 1);
        assert.deepEqual(this.metrics.increment.args[0], [
          {
            name: 'kokiri_redirect',
            status: 'success',
          },
        ]);
      })
    );

    it(
      'handles failed redirects',
      mochaAsync(async function() {
        this.redis.getSet = async () => Promise.reject('blork');
        const result = await this.kokiriAdapter.maybeRedirect(
          this.redis,
          'http://groupon.com/coupons/click/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
        );

        assert.deepEqual(result, {
          affiliate: {
            display_name: 'Groupon',
            hostname: 'groupon.com',
            query_url_keys: [],
          },
          shouldRedirect: true,
          targetUrl: null,
        });

        assert.equal(this.metrics.increment.callCount, 1);
        assert.deepEqual(this.metrics.increment.args[0], [
          {
            name: 'kokiri_redirect',
            status: 'failure',
          },
        ]);
      })
    );
  });

  describe('#cleanExperience', function() {
    it('cleans an experience object without mutating', function() {
      assert.deepEqual(this.kokiriAdapter.cleanExperience(), {});
      assert.deepEqual(this.kokiriAdapter.cleanExperience({}), {});
      assert.deepEqual(this.kokiriAdapter.cleanExperience({ bloop: true }), {});
      assert.deepEqual(
        this.kokiriAdapter.cleanExperience({
          btn_fallback_exp: 'web',
          bloop: true,
        }),
        { btn_fallback_exp: 'web' }
      );
      assert.deepEqual(
        this.kokiriAdapter.cleanExperience({
          btn_fallback_exp: 'web',
          btn_desktop_url: '',
          btn_mobile_url: '',
        }),
        { btn_fallback_exp: 'web', btn_desktop_url: '', btn_mobile_url: '' }
      );

      const experience = { btn_fallback_exp: 'web', bloop: true };
      assert.deepEqual(this.kokiriAdapter.cleanExperience(experience), {
        btn_fallback_exp: 'web',
      });
      assert.deepEqual(experience, { btn_fallback_exp: 'web', bloop: true });
    });
  });

  describe('#redirectAttributes', function() {
    it('returns redirect information about a link', function() {
      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://click.linksynergy.com?murl=https%3A%2F%2Fhotels.com/1/2',
          'org-XXX'
        ),
        {
          shouldRedirect: false,
          cacheKey: 'click.linksynergy.com/',
          affiliate: {
            hostname: 'click.linksynergy.com',
            display_name: 'Rakuten Linkshare',
            query_url_keys: [{ key: 'murl' }, { key: 'url' }],
          },
        }
      );
    });
  });

  describe('#linkAttributes', function() {
    it('returns attributes about an affiliate link', function() {
      assert.deepEqual(
        this.kokiriAdapter.linkAttributes(
          'https://click.linksynergy.com?murl=https%3A%2F%2Fhotels.com/1/2',
          'org-XXX'
        ),
        {
          merchantId: 'org-3573c6b896624279',
          approved: true,
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.linkAttributes(
          'https://click.linksynergy.com',
          'org-XXX'
        ),
        {
          merchantId: null,
          approved: false,
        }
      );
    });

    it('returns attributes about a link', function() {
      assert.deepEqual(
        this.kokiriAdapter.linkAttributes('https://hotels.com/1/2', 'org-XXX'),
        {
          merchantId: 'org-3573c6b896624279',
          approved: true,
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.linkAttributes('https://huh.com/1/2', 'org-XXX'),
        {
          merchantId: null,
          approved: false,
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.linkAttributes('https://groupon.com/1/2', 'org-XXX'),
        {
          merchantId: 'org-681847bf6cc4d57c',
          approved: false,
        }
      );
    });

    it('returns attributes about a bttnio link', function() {
      assert.deepEqual(
        this.kokiriAdapter.linkAttributes(
          'https://track.bttn.io/bloop/2',
          'org-XXX'
        ),
        {
          merchantId: 'org-3573c6b896624279',
          approved: true,
        }
      );
    });

    it('returns attributes about null', function() {
      assert.deepEqual(this.kokiriAdapter.linkAttributes(null, 'org-XXX'), {
        merchantId: null,
        approved: false,
      });
    });
  });

  describe('#supportMatrix', function() {
    it('returns a support matrix for a platform', function() {
      assert.deepEqual(
        this.kokiriAdapter.supportMatrix(
          'https://hotels.com',
          'org-XXX',
          'ios'
        ),
        {
          appToApp: true,
          appToWeb: true,
          webToApp: false,
          webToAppWithInstall: false,
          webToWeb: true,
        }
      );
    });

    it('returns a support matrix for an unsupported platform', function() {
      assert.deepEqual(
        this.kokiriAdapter.supportMatrix(
          'https://mrandmrssmith.com',
          'org-XXX',
          'android'
        ),
        {
          appToApp: false,
          appToWeb: false,
          webToApp: false,
          webToAppWithInstall: false,
          webToWeb: false,
        }
      );
    });

    it('returns a support matrix for an unapproved partner', function() {
      assert.deepEqual(
        this.kokiriAdapter.supportMatrix(
          'https://hotels.com',
          'org-CHRIS',
          'ios'
        ),
        {
          appToApp: false,
          appToWeb: false,
          webToApp: false,
          webToAppWithInstall: false,
          webToWeb: false,
        }
      );
    });

    it('returns a support matrix for an unknown partner', function() {
      assert.deepEqual(
        this.kokiriAdapter.supportMatrix('https://pup.biz', 'org-CHRIS', 'ios'),
        {
          appToApp: false,
          appToWeb: false,
          webToApp: false,
          webToAppWithInstall: false,
          webToWeb: false,
        }
      );
    });
  });

  describe('#sdkConfig', function() {
    it('returns an sdk config', function() {
      assert.deepEqual(this.kokiriAdapter.sdkConfig('org-XXX'), {
        supported_hostnames: [
          { hostname: 'hotels.com' },
          { hostname: 'uk.hotels.com' },
        ],
        supported_bttnio_subdomains: [
          { subdomain: 'bloop' },
          { subdomain: 'bloop-tracking' },
        ],
        supported_affiliates: [
          {
            hostname: 'click.linksynergy.com',
            query_url_keys: [{ key: 'murl' }, { key: 'url' }],
            query_ids: [],
            pathname_ids: [],
          },
          {
            hostname: 'quidco.com',
            query_url_keys: [],
            query_ids: [],
            pathname_ids: [
              {
                regex: String.raw`(?:^|\/)(?:\w{1,}-)?visit\/(\d{1,})(?:$|\/.*)`,
                guaranteed_action: true,
                matches: [{ values: ['244'] }],
              },
            ],
          },
          {
            hostname: 'vouchercloud.com',
            query_url_keys: [],
            query_ids: [],
            pathname_ids: [
              {
                regex: String.raw`(?:^|\/)(\w{1,})\/(\w{1,})\/\d{1,}(?:$|\/.*)`,
                guaranteed_action: false,
                matches: [
                  {
                    values: ['out', 'offer'],
                  },
                ],
              },
            ],
          },
          {
            hostname: 'groupon.com',
            query_url_keys: [],
            query_ids: [],
            pathname_ids: [
              {
                regex: String.raw`(?:^|\/)(\w{1,})\/(\w{1,})\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:$|\/.*)`,
                guaranteed_action: false,
                matches: [
                  {
                    values: ['coupons', 'click'],
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });

  describe('#appAction', function() {
    it('succesfully returns links and merchantId', function() {
      assert.deepEqual(
        this.kokiriAdapter.appAction(
          'http://track.bttn.io/bloop',
          'org-XXX',
          'ios',
          'srctok-XXX',
          {
            request: {
              url: 'https://api.usebutton.com/v1/session/get-links',
              method: 'POST',
            },
            state: {
              requestId: 1234,
            },
          }
        ),
        {
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      const verifyRequest = {
        reqid: 1234,
        http_method: 'POST',
        path: '/v1/session/get-links',
        publisher_organization_id: 'org-XXX',
        merchant_organization_id: 'org-3573c6b896624279',
        url: 'http://track.bttn.io/bloop',
        is_supported: true,
        is_approved: true,
        experience: null,
        universal_link: null,
        app_action: JSON.stringify({
          app_link:
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }),
        web_action: null,
      };
      verifyRequest.date = this.bigqueryLogger.scheduleInsert.args[0][1].date;
      assert.deepEqual(
        this.bigqueryLogger.scheduleInsert.args[0][1],
        verifyRequest
      );

      assert.equal(this.metrics.increment.callCount, 1);
      assert.deepEqual(this.metrics.increment.args[0][0], {
        name: 'kokiri_enhance_link',
        type: 'app-action',
        status: 'success',
        publisher: 'org-XXX',
        merchant: 'org-3573c6b896624279',
        statsdName: 'kokiri.success',
      });
    });

    it('returns null on error and increments metrics', function() {
      const ctx = {
        request: {
          url: 'https://api.usebutton.com/v1/session/get-links',
          method: 'POST',
        },
        state: {
          requestId: 1234,
        },
      };
      assert.equal(
        this.kokiriAdapter.appAction(
          'https://pavel.net',
          'org-YYY',
          'ios',
          'srctok-XXX',
          ctx
        ),
        null
      );

      const verifyRequest = {
        reqid: 1234,
        http_method: 'POST',
        path: '/v1/session/get-links',
        publisher_organization_id: 'org-YYY',
        merchant_organization_id: null,
        url: 'https://pavel.net',
        is_supported: false,
        is_approved: true,
        experience: null,
        universal_link: null,
        web_action: null,
        app_action: null,
      };
      verifyRequest.date = this.bigqueryLogger.scheduleInsert.args[0][1].date;
      assert.deepEqual(
        this.bigqueryLogger.scheduleInsert.args[0][1],
        verifyRequest
      );

      assert.equal(this.metrics.increment.callCount, 1);
      assert.deepEqual(this.metrics.increment.args[0][0], {
        name: 'kokiri_enhance_link',
        type: 'app-action',
        status: 'error',
        publisher: 'org-YYY',
        merchant: null,
        statsdName: 'kokiri.error',
      });
    });

    it('returns null with insufficient arguments', function() {
      assert.equal(this.kokiriAdapter.appAction(), null);
      assert.equal(this.kokiriAdapter.appAction('url'), null);
      assert.equal(this.kokiriAdapter.appAction(null, 'org-YYY', '', {}));
    });
  });

  describe('#webAction', function() {
    it('succesfully returns links and merchantId', function() {
      assert.deepEqual(
        this.kokiriAdapter.webAction(
          'http://hotels.com/bloop',
          'org-XXX',
          'ios',
          'srctok-XXX',
          {
            request: {
              url: 'https://kokiri.com/v1/links/web-action',
              method: 'POST',
            },
            state: {
              requestId: 1234,
            },
          }
        ),
        {
          app_link:
            'https://hotels.bttn.io/bloop?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_refkey=rffrid&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hotels.com/bloop?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        omit(this.bigqueryLogger.scheduleInsert.args[0][1], ['date']),
        {
          reqid: 1234,
          http_method: 'POST',
          path: '/v1/links/web-action',
          publisher_organization_id: 'org-XXX',
          merchant_organization_id: 'org-3573c6b896624279',
          url: 'http://hotels.com/bloop',
          is_supported: true,
          is_approved: true,
          experience: null,
          universal_link: null,
          app_action: null,
          web_action: JSON.stringify({
            app_link:
              'https://hotels.bttn.io/bloop?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_refkey=rffrid&btn_ref=srctok-XXX',
            browser_link:
              'https://www.hotels.com/bloop?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          }),
        }
      );

      assert.equal(this.metrics.increment.callCount, 1);
      assert.deepEqual(this.metrics.increment.args[0][0], {
        name: 'kokiri_enhance_link',
        type: 'web-action',
        status: 'success',
        publisher: 'org-XXX',
        merchant: 'org-3573c6b896624279',
        statsdName: 'kokiri.success',
      });
    });

    it('returns null on error and increments metrics', function() {
      const ctx = {
        request: {
          url: 'https://kokiri.com/v1/links/web-action',
          method: 'POST',
        },
        state: {
          requestId: 1234,
        },
      };

      assert.equal(
        this.kokiriAdapter.webAction(
          'https://pavel.net',
          'org-YYY',
          'ios',
          'srctok-XXX',
          ctx
        ),
        null
      );

      assert.deepEqual(
        omit(this.bigqueryLogger.scheduleInsert.args[0][1], 'date'),
        {
          reqid: 1234,
          http_method: 'POST',
          path: '/v1/links/web-action',
          publisher_organization_id: 'org-YYY',
          merchant_organization_id: null,
          url: 'https://pavel.net',
          is_supported: false,
          is_approved: true,
          experience: null,
          universal_link: null,
          app_action: null,
          web_action: undefined,
        }
      );

      assert.equal(this.metrics.increment.callCount, 1);
      assert.deepEqual(this.metrics.increment.args[0][0], {
        name: 'kokiri_enhance_link',
        type: 'web-action',
        status: 'error',
        publisher: 'org-YYY',
        merchant: null,
        statsdName: 'kokiri.error',
      });
    });

    it('returns null with insufficient arguments', function() {
      assert.equal(this.kokiriAdapter.webAction(), null);
      assert.equal(this.kokiriAdapter.webAction('url'), null);
      assert.equal(this.kokiriAdapter.webAction(null, 'org-YYY', '', {}));
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      const ctx = {
        request: {
          url: 'https://api.usebutton.com/v1/links',
          method: 'POST',
        },
        state: {
          requestId: 1234,
        },
      };
      const universalLink = this.kokiriAdapter.universalLink(
        'https://hotels.com',
        'org-XXX',
        'ios',
        {},
        'srctok-XXX',
        ctx
      );

      const verifyRequest = {
        reqid: 1234,
        http_method: 'POST',
        path: '/v1/links',
        publisher_organization_id: 'org-XXX',
        merchant_organization_id: 'org-3573c6b896624279',
        url: 'https://hotels.com',
        is_supported: true,
        is_approved: true,
        experience: '{}',
        universal_link:
          'https://track.bttn.io/hotels?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_refkey=rffrid&btn_ref=srctok-XXX',
        app_action: null,
        web_action: null,
      };
      verifyRequest.date = this.bigqueryLogger.scheduleInsert.args[0][1].date;
      assert.deepEqual(
        this.bigqueryLogger.scheduleInsert.args[0][1],
        verifyRequest
      );

      assert.deepEqual(
        universalLink,
        'https://track.bttn.io/hotels?rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_refkey=rffrid&btn_ref=srctok-XXX'
      );

      assert.equal(this.metrics.increment.callCount, 1);
      assert.deepEqual(this.metrics.increment.args[0][0], {
        name: 'kokiri_enhance_link',
        type: 'universal-link',
        status: 'success',
        publisher: 'org-XXX',
        merchant: 'org-3573c6b896624279',
        statsdName: 'kokiri.success',
      });
    });

    it('returns a universal link for static affiliation', function() {
      const ctx = {
        request: {
          url: 'https://api.usebutton.com/v1/links',
          method: 'POST',
        },
        state: {
          requestId: 1234,
        },
      };
      const universalLink = this.kokiriAdapter.universalLink(
        'https://hotels.com',
        'org-XXX',
        'ios',
        {},
        null,
        ctx
      );

      assert.deepEqual(
        universalLink,
        'https://track.bttn.io/hotels?rffrid=aff.hcom.GL.049.000.00699.019.org-XXX&btn_refkey=rffrid&btn_ref=org-XXX'
      );

      assert.equal(this.metrics.increment.callCount, 1);
      assert.deepEqual(this.metrics.increment.args[0][0], {
        name: 'kokiri_enhance_link',
        type: 'universal-link',
        status: 'success',
        publisher: 'org-XXX',
        merchant: 'org-3573c6b896624279',
        statsdName: 'kokiri.success',
      });
    });

    it('returns a universal link with experience parameters', function() {
      const ctx = {
        request: {
          url: 'https://api.usebutton.com/v1/links',
          method: 'POST',
        },
        state: {
          requestId: 1234,
        },
      };
      const universalLink = this.kokiriAdapter.universalLink(
        'https://hotels.com?a=1',
        'org-XXX',
        'ios',
        { btn_fallback_exp: 'appstore' },
        'srctok-XXX',
        ctx
      );

      assert.deepEqual(
        universalLink,
        'https://track.bttn.io/hotels?a=1&btn_fallback_exp=appstore&rffrid=aff.hcom.GL.049.000.00699.019.srctok-XXX&btn_refkey=rffrid&btn_ref=srctok-XXX'
      );

      assert.equal(this.metrics.increment.callCount, 1);
      assert.deepEqual(this.metrics.increment.args[0][0], {
        name: 'kokiri_enhance_link',
        type: 'universal-link',
        status: 'success',
        publisher: 'org-XXX',
        merchant: 'org-3573c6b896624279',
        statsdName: 'kokiri.success',
      });
    });

    it('returns null for an unsupported link', function() {
      const ctx = {
        request: {
          url: 'https://api.usebutton.com/v1/links',
          method: 'POST',
        },
        state: {
          requestId: 1234,
        },
      };
      const universalLink = this.kokiriAdapter.universalLink(
        'https://pavel.com',
        'org-XXX',
        'ios',
        {},
        'srctok-XXX',
        ctx
      );

      assert.deepEqual(universalLink, null);

      assert.equal(this.metrics.increment.callCount, 1);
      assert.deepEqual(this.metrics.increment.args[0][0], {
        name: 'kokiri_enhance_link',
        type: 'universal-link',
        status: 'error',
        publisher: 'org-XXX',
        merchant: null,
        statsdName: 'kokiri.error',
      });
    });

    it('returns null for an unapproved link', function() {
      const ctx = {
        request: {
          url: 'https://api.usebutton.com/v1/links',
          method: 'POST',
        },
        state: {
          requestId: 1234,
        },
      };
      const universalLink = this.kokiriAdapter.universalLink(
        'https://hotels.com',
        'org-YYY',
        'ios',
        {},
        'srctok-XXX',
        ctx
      );

      assert.deepEqual(universalLink, null);

      assert.equal(this.metrics.increment.callCount, 1);
      assert.deepEqual(this.metrics.increment.args[0][0], {
        name: 'kokiri_enhance_link',
        type: 'universal-link',
        status: 'error',
        publisher: 'org-YYY',
        merchant: 'org-3573c6b896624279',
        statsdName: 'kokiri.error',
      });
    });

    it('returns null for a null input link', function() {
      const ctx = {
        request: {
          url: null,
          method: 'POST',
        },
        state: {
          requestId: 1234,
        },
      };
      const universalLink = this.kokiriAdapter.universalLink(
        null,
        'org-XXX',
        'ios',
        {},
        'srctok-XXX',
        ctx
      );

      assert.deepEqual(universalLink, null);
    });
  });

  it('formats comstore approvals', function() {
    assert.deepEqual(this.kokiriAdapter.approvals(), [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-3573c6b896624279',
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-3573c6b896624279',
      },
    ]);
  });

  it('formats comstore web to app mappings', function() {
    assert.deepEqual(this.kokiriAdapter.webToAppMappings(), [
      {
        subdomain_name: 'bloop',
        organization: 'org-3573c6b896624279',
        external_host: 'https://hotels.com',
      },
      {
        subdomain_name: 'bloop-tracking',
        organization: 'org-3573c6b896624279',
        external_host: 'https://t.hotels.com',
      },
    ]);
  });
});
