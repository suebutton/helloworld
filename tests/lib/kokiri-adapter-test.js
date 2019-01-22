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

    this.errorLogger = {
      logError: sinon.spy(),
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

    const partnerParameters = new Map([
      [
        'a',
        {
          organization: 'org-3573c6b896624279',
          name: 'rffrid-number',
          default_value: '00699.019',
        },
      ],
    ]);

    const partnerValues = new Map([]);

    this.clientStore = {
      approvals,
      webToAppMappings,
      partnerParameters,
      partnerValues,
    };

    this.kokiriAdapter = new KokiriAdapter(
      this.metrics,
      this.clientStore,
      this.bigqueryLogger,
      this.errorLogger
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

  describe('#redirectAttributes', function() {
    it('returns redirect information about a link', function() {
      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://click.linksynergy.com/deeplink?murl=https%3A%2F%2Fhotels.com/1/2',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey:
            'click.linksynergy.com/deeplink?murl=https%3A%2F%2Fhotels.com%2F1%2F2',
          affiliate: {
            hostname: 'click.linksynergy.com',
            display_name: 'Rakuten Linkshare',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://click.linksynergy.com/fs-bin/click?murl=https%3A%2F%2Fhotels.com/1/2',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey:
            'click.linksynergy.com/fs-bin/click?murl=https%3A%2F%2Fhotels.com%2F1%2F2',
          affiliate: {
            hostname: 'click.linksynergy.com',
            display_name: 'Rakuten Linkshare',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://click.linksynergy.com/link?id=QFGLnEolOWg&offerid=426126&type=15&murl=https%3A%2F%2Fwww.walmart.com%2Fip%2FWomen-s-V-neck-Lightweight-T-Shirt%2F590765248&u1=.NTI3MjEtMTk0OA.47f52d26-b2d3-11e8-af3d-63a8c0f16a71',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey:
            'click.linksynergy.com/link?id=QFGLnEolOWg&offerid=426126&type=15&murl=https%3A%2F%2Fwww.walmart.com%2Fip%2FWomen-s-V-neck-Lightweight-T-Shirt%2F590765248',
          affiliate: {
            hostname: 'click.linksynergy.com',
            display_name: 'Rakuten Linkshare',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://prf.hn/click/camref:1011l4Qa/pubref:ebs2001612267sbe/creativeref:1101l28938',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey: 'prf.hn/creativeref:1101l28938',
          affiliate: {
            hostname: 'prf.hn',
            display_name: 'PHG',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://prf.hn/click/camref:1011l4Qa/pubref:ebs2001654246sbe/destination:https%3A%2F%2Fwww.expedia.com%2Fg%2Fu%2Fcalifornia',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey:
            'prf.hn/destination:https%3A%2F%2Fwww.expedia.com%2Fg%2Fu%2Fcalifornia',
          affiliate: {
            hostname: 'prf.hn',
            display_name: 'PHG',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://aos.prf.hn/click/camref:1011l4Qa/pubref:ebs2001654240sbe/destination:https%3A%2F%2Fwww.expedia.com%2Fg%2Fu%2Fcruisedeals',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey:
            'aos.prf.hn/destination:https%3A%2F%2Fwww.expedia.com%2Fg%2Fu%2Fcruisedeals',
          affiliate: {
            hostname: 'aos.prf.hn',
            display_name: 'PHG',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.anrdoezrs.net/click-4441350-10668447?url=https%3A%2F%2Fwww.overstock.com%2FHome-Garden%2FMadison-Park-Lea-Dark-Blue-Accent-Chair%2F20219255%2Fproduct.html&sid=.Mjc0NjE1LTE5NDg.7754133a-177b-11e9-94b0-078901598fed',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey:
            'www.anrdoezrs.net/click-4441350-10668447?url=https%3A%2F%2Fwww.overstock.com%2FHome-Garden%2FMadison-Park-Lea-Dark-Blue-Accent-Chair%2F20219255%2Fproduct.html',
          affiliate: {
            hostname: 'anrdoezrs.net',
            display_name: 'CJ',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.kqzyfj.com/click-4441350-10654383?url=https%3A%2F%2Fwww.overstock.com%2F10866197%2Fproduct.html%3FTRACK%3Daffcjfeed%26CID%3D207442%26fp%3DF&sid=.Mjc0NjE1LTE5NDg.2d698ec4-177a-11e9-9ca8-078901598fed',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey:
            'www.kqzyfj.com/click-4441350-10654383?url=https%3A%2F%2Fwww.overstock.com%2F10866197%2Fproduct.html%3FTRACK%3Daffcjfeed%26CID%3D207442%26fp%3DF',
          affiliate: {
            hostname: 'kqzyfj.com',
            display_name: 'CJ',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.jdoqocy.com/click-46157-13482117-1539120008000?testing=true&sid=ebs1998890988sbe',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey:
            'www.jdoqocy.com/click-46157-13482117-1539120008000?testing=true',
          affiliate: {
            hostname: 'jdoqocy.com',
            display_name: 'CJ',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.shareasale.com/r.cfm?u=687298&b=478961&m=47174&urllink=https%3A%2F%2Fwww.warbyparker.com%2Feyeglasses%2Fwomen%2Feugene-small%2Frosewood-tortoise&afftrack=.MTY1MzcyLTE5NDg.491a539b-b2c8-11e8-b31a-4f869940b2fe',
          'org-XXX'
        ),
        {
          shouldRedirect: false,
          cacheKey: 'www.shareasale.com/r.cfm',
          affiliate: {
            hostname: 'shareasale.com',
            display_name: 'ShareASale',
            query_url_keys: [{ key: 'urllink' }],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://redirect.viglink.com/?key=4f9aabd355fb32289803410c24d4d8e3&u=https%3A%2F%2Fwww.amazon.com%2FRoku-Premiere-HDR-Streaming-Player-Premium%2Fdp%2FB07HDBZN7Q%3Ftag%3Dcheapskate08-20&reaf=false&opt=false',
          'org-XXX'
        ),
        {
          shouldRedirect: false,
          cacheKey: 'redirect.viglink.com/',
          affiliate: {
            hostname: 'redirect.viglink.com',
            display_name: 'VigLink',
            query_url_keys: [{ key: 'u' }],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.awin1.com/pclick.php?p=6078106925&a=136348&m=6220&clickref=.MjQzODk1LTE5NDg.dd6a8db8-b2ce-11e8-bd5d-a567e761c230',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey: 'www.awin1.com/pclick.php?p=6078106925&a=136348&m=6220',
          affiliate: {
            hostname: 'awin1.com',
            display_name: 'Awin',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://hpn.houzz.com/c/10579/413871/5454?SubID1=ebs1988675508sbe',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey: 'hpn.houzz.com/c/10579/413871/5454?',
          affiliate: {
            hostname: 'hpn.houzz.com',
            display_name: 'Impact Radius',
            query_url_keys: [],
          },
        }
      );
    });

    it('returns redirect information about a matching link and drops the correct parameter', function() {
      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://click.linksynergy.com/fs-bin/click?murl=https%3A%2F%2Fhotels.com%2F1%2F2&u1=ebs1234',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey:
            'click.linksynergy.com/fs-bin/click?murl=https%3A%2F%2Fhotels.com%2F1%2F2',
          affiliate: {
            hostname: 'click.linksynergy.com',
            display_name: 'Rakuten Linkshare',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.shareasale.com/r.cfm?u=687298&b=478961&m=47174&urllink=https%3A%2F%2Fwww.warbyparker.com%2Feyeglasses%2Fwomen%2Feugene-small%2Frosewood-tortoise&afftrack=.MTY1MzcyLTE5NDg.491a539b-b2c8-11e8-b31a-4f869940b2fe',
          'org-XXX'
        ),
        {
          shouldRedirect: false,
          cacheKey: 'www.shareasale.com/r.cfm',
          affiliate: {
            hostname: 'shareasale.com',
            display_name: 'ShareASale',
            query_url_keys: [{ key: 'urllink' }],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://redirect.viglink.com/?key=4f9aabd355fb32289803410c24d4d8e3&u=https%3A%2F%2Fwww.amazon.com%2FRoku-Premiere-HDR-Streaming-Player-Premium%2Fdp%2FB07HDBZN7Q%3Ftag%3Dcheapskate08-20&reaf=false&opt=false',
          'org-XXX'
        ),
        {
          shouldRedirect: false,
          cacheKey: 'redirect.viglink.com/',
          affiliate: {
            hostname: 'redirect.viglink.com',
            display_name: 'VigLink',
            query_url_keys: [{ key: 'u' }],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.awin1.com/pclick.php?p=6078106925&a=136348&m=6220&clickref=.MjQzODk1LTE5NDg.dd6a8db8-b2ce-11e8-bd5d-a567e761c230',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey: 'www.awin1.com/pclick.php?p=6078106925&a=136348&m=6220',
          affiliate: {
            hostname: 'awin1.com',
            display_name: 'Awin',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.anrdoezrs.net/click-46157-12264133?sid=ebs18885910e',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey: 'www.anrdoezrs.net/click-46157-12264133?',
          affiliate: {
            hostname: 'anrdoezrs.net',
            display_name: 'CJ',
            query_url_keys: [],
          },
        }
      );

      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.kqzyfj.com/click-8415784-10660208?sid=ebs1891031sbe',
          'org-XXX'
        ),
        {
          shouldRedirect: true,
          cacheKey: 'www.kqzyfj.com/click-8415784-10660208?',
          affiliate: {
            hostname: 'kqzyfj.com',
            display_name: 'CJ',
            query_url_keys: [],
          },
        }
      );
    });

    it('does not return a link when a query URL key is not present', function() {
      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'http://www.shareasale.com/m-pr.cfm?merchantID=47174&userID=687298&productID=553241839&afftrack=.MjU4NDItMA.66b141bc-b2c8-11e8-bbfa-db2bdbc42f8',
          'org-XXX'
        ),
        {
          shouldRedirect: false,
          cacheKey: 'www.shareasale.com/m-pr.cfm',
          affiliate: {
            hostname: 'shareasale.com',
            display_name: 'ShareASale',
            query_url_keys: [{ key: 'urllink' }],
          },
        }
      );
    });

    it('does not return a link when a query URL key is not present', function() {
      assert.deepEqual(
        this.kokiriAdapter.redirectAttributes(
          'https://redirect.viglink.com/?key=4f9aabd355fb32289803410c24d4d8e3&u=https%3A%2F%2Fwww.amazon.com%2FRoku-Premiere-HDR-Streaming-Player-Premium%2Fdp%2FB07HDBZN7Q%3Ftag%3Dcheapskate08-20&reaf=false&opt=false',
          'org-XXX'
        ),
        {
          shouldRedirect: false,
          cacheKey: 'redirect.viglink.com/',
          affiliate: {
            hostname: 'redirect.viglink.com',
            display_name: 'VigLink',
            query_url_keys: [{ key: 'u' }],
          },
        }
      );
    });
  });

  describe('#linkAttributes', function() {
    it('returns attributes about an affiliate link', function() {
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
          webToApp: true,
          webToAppWithInstall: true,
          webToWeb: true,
        }
      );
    });

    it('respects no post install attribution', function() {
      assert.deepEqual(
        this.kokiriAdapter.supportMatrix(
          'https://hotels.com?btn_fallback_exp=web',
          'org-XXX',
          'ios'
        ),
        {
          appToApp: true,
          appToWeb: true,
          webToApp: true,
          webToAppWithInstall: false,
          webToWeb: true,
        }
      );
    });

    it('it understands fallback experience', function() {
      assert.deepEqual(
        this.kokiriAdapter.supportMatrix(
          'https://hotels.com?btn_fallback_exp=interstitial',
          'org-XXX',
          'ios'
        ),
        {
          appToApp: true,
          appToWeb: true,
          webToApp: true,
          webToAppWithInstall: true,
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
          { hostname: 'hoteis.com' },
          { hostname: 'hotels.com' },
          { hostname: 'au.hotels.com' },
          { hostname: 'ca.hotels.com' },
          { hostname: 'ch.hotels.com' },
          { hostname: 'de.hotels.com' },
          { hostname: 'es.hotels.com' },
          { hostname: 'fi.hotels.com' },
          { hostname: 'fr.hotels.com' },
          { hostname: 'ie.hotels.com' },
          { hostname: 'it.hotels.com' },
          { hostname: 'sg.hotels.com' },
          { hostname: 'sv.hotels.com' },
          { hostname: 'uk.hotels.com' },
        ],
        supported_bttnio_subdomains: [
          { subdomain: 'bloop' },
          { subdomain: 'bloop-tracking' },
        ],
        supported_affiliates: [
          {
            hostname: 'click.linksynergy.com',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?(?:fs-bin\/click|deeplink|link)(?:$|\/.*)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
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
            hostname: 'prf.hn',
            query_url_keys: [],
            query_ids: [],
            pathname_ids: [
              {
                regex: String.raw`(?:^|\/)click\/camref:[^/]+\/pubref:[^/]+\/(?:creativeref|destination):.+`,
                guaranteed_action: false,
                matches: [{ values: [] }],
              },
            ],
          },
          {
            hostname: 'aos.prf.hn',
            query_url_keys: [],
            query_ids: [],
            pathname_ids: [
              {
                regex: String.raw`(?:^|\/)click\/camref:[^/]+\/pubref:[^/]+\/(?:creativeref|destination):.+`,
                guaranteed_action: false,
                matches: [{ values: [] }],
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
          {
            hostname: 'linksynergy.walmart.com',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?(?:fs-bin\/click|deeplink|link)(?:$|\/.*)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
          },
          {
            hostname: 'anrdoezrs.net',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?click-[0-9]+-[0-9]+(?:-[0-9]+)?(?:$|\/)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
          },
          {
            hostname: 'dpbolvw.net',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?click-[0-9]+-[0-9]+(?:-[0-9]+)?(?:$|\/)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
          },
          {
            hostname: 'jdoqocy.com',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?click-[0-9]+-[0-9]+(?:-[0-9]+)?(?:$|\/)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
          },
          {
            hostname: 'kqzyfj.com',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?click-[0-9]+-[0-9]+(?:-[0-9]+)?(?:$|\/)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
          },
          {
            hostname: 'qksrv.net',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?click-[0-9]+-[0-9]+(?:-[0-9]+)?(?:$|\/)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
          },
          {
            hostname: 'tkqlhce.com',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?click-[0-9]+-[0-9]+(?:-[0-9]+)?(?:$|\/)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
          },
          {
            hostname: 'shareasale.com',
            pathname_ids: [],
            query_ids: [],
            query_url_keys: [{ key: 'urllink' }],
          },
          {
            hostname: 'awin1.com',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?(?:cread|pclick|awclick)\.php(?:$|\/.*)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
          },
          {
            hostname: 'hpn.houzz.com',
            pathname_ids: [
              {
                guaranteed_action: false,
                matches: [{ values: [] }],
                regex: String.raw`^\/?c\/[0-9]+\/[0-9]+\/[0-9]+(?:$|\/)`,
              },
            ],
            query_ids: [],
            query_url_keys: [],
          },
          {
            hostname: 'redirect.viglink.com',
            pathname_ids: [],
            query_ids: [],
            query_url_keys: [{ key: 'u' }],
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
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
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
            'hotelsapp://www.hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://hotels.com?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
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
      });
    });

    it('returns null with insufficient arguments', function() {
      assert.equal(this.kokiriAdapter.appAction(), null);
      assert.equal(this.kokiriAdapter.appAction('url'), null);
      assert.equal(this.kokiriAdapter.appAction(null, 'org-YYY', '', {}));
    });

    it('doesnt log non-kokiri errors', function() {
      assert.deepEqual(
        this.kokiriAdapter.appAction(
          'https://unknownmerchant.com',
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
        null
      );

      const verifyRequest = {
        reqid: 1234,
        http_method: 'POST',
        path: '/v1/session/get-links',
        publisher_organization_id: 'org-XXX',
        merchant_organization_id: null,
        url: 'https://unknownmerchant.com',
        is_supported: false,
        is_approved: true,
        experience: null,
        universal_link: null,
        app_action: undefined,
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
        status: 'error',
        publisher: 'org-XXX',
        merchant: null,
      });

      assert.equal(this.errorLogger.logError.callCount, 0);
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
            'https://hotels.bttn.io/bloop?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://hotels.com/bloop?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
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
              'https://hotels.bttn.io/bloop?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
            browser_link:
              'https://hotels.com/bloop?rffrid=aff.hcom.US.049.000.00699.019.srctok-XXX&btn_ref=srctok-XXX',
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
      });
    });

    it('returns null with insufficient arguments', function() {
      assert.equal(this.kokiriAdapter.webAction(), null);
      assert.equal(this.kokiriAdapter.webAction('url'), null);
      assert.equal(this.kokiriAdapter.webAction(null, 'org-YYY', '', {}));
    });

    it('doesnt log non-kokiri errors', function() {
      assert.deepEqual(
        this.kokiriAdapter.webAction(
          'https://unknownmerchant.com',
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
        null
      );

      const verifyRequest = {
        reqid: 1234,
        http_method: 'POST',
        path: '/v1/session/get-links',
        publisher_organization_id: 'org-XXX',
        merchant_organization_id: null,
        url: 'https://unknownmerchant.com',
        is_supported: false,
        is_approved: true,
        experience: null,
        universal_link: null,
        app_action: undefined,
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
        type: 'web-action',
        status: 'error',
        publisher: 'org-XXX',
        merchant: null,
      });

      assert.equal(this.errorLogger.logError.callCount, 0);
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

  it('retrieves example links', function() {
    const actual = this.kokiriAdapter.exampleLinks('org-3573c6b896624279');
    const homepage = actual.find(e => e.bucket === 'Homepage');
    assert.deepEqual(homepage, {
      url: 'http://www.hotels.com',
      merchant_id: 'org-3573c6b896624279',
      bucket: 'Homepage',
      label: 'Hotels.com Homepage',
    });
  });

  it('generates app linking support', function() {
    const expected = {
      webToApp: false,
      appToApp: true,
    };
    const actual = this.kokiriAdapter.appLinkingSupport(
      'ios',
      'org-3573c6b896624279',
      'https://www.hotels.com'
    );
    assert.deepEqual(actual, expected);
  });
});
