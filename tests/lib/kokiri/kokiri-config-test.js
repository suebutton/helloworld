const assert = require('assert');
const crypto = require('crypto');

const KokiriConfig = require('../../../lib/kokiri/kokiri-config');

const PUBLISHER_ID = 'org-XXX';

/**
 * Helper method for returning a new config that has been serialized and
 * deserialized using its wire format.  This ensures all tests pass using a
 * "remote" client as well as a direct client.
 */
function createConfigMaybeRemote(
  useRemote,
  supportedMerchants,
  supportedAffiliateQueryIds,
  supportedAffiliatePathnameIds,
  supportedAffiliates,
  webToAppMappings,
  approvals
) {
  const kokiriConfig = new KokiriConfig(
    supportedMerchants,
    supportedAffiliateQueryIds,
    supportedAffiliatePathnameIds,
    supportedAffiliates,
    webToAppMappings,
    approvals
  );

  if (!useRemote) {
    return kokiriConfig;
  }

  return KokiriConfig.fromModuleConfig(
    kokiriConfig.toModuleConfig(PUBLISHER_ID)
  );
}

describe('lib/kokiri/kokiri-config', function() {
  [
    { useRemote: false, message: 'when using a standard config' },
    { useRemote: true, message: 'when using a hydrated config' },
  ].forEach(function({ useRemote, message }) {
    const createConfig = createConfigMaybeRemote.bind(null, useRemote);

    describe(message, function() {
      describe('#merchantIdFromSupportedMerchants', function() {
        beforeEach(function() {
          const supportedMerchants = [
            { hostname: 'bloop.net', organization_id: PUBLISHER_ID },
            { hostname: 'bloop.com', organization_id: 'org-3573c6b896624279' },
            { hostname: 'click.bloop.com', organization_id: 'org-YYY' },
          ];

          const approvals = [
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-3573c6b896624279',
            },
          ];

          this.config = createConfig(
            supportedMerchants,
            [],
            [],
            [],
            [],
            approvals
          );
        });

        it('returns a merchant id for a known hostname', function() {
          assert.equal(
            this.config.merchantIdFromSupportedMerchants(
              'bloop.com',
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );
        });

        it('returns a merchant id for a known hostname with www prefix', function() {
          assert.equal(
            this.config.merchantIdFromSupportedMerchants(
              'www.bloop.com',
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );
        });

        it('returns null for unknown hostnames', function() {
          assert.equal(
            this.config.merchantIdFromSupportedMerchants(
              'bleep.co.uk',
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns null for a bad config', function() {
          assert.equal(
            this.config.merchantIdFromSupportedMerchants(
              'bleep.co.uk',
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns null for a null url', function() {
          assert.equal(
            this.config.merchantIdFromSupportedMerchants(null, PUBLISHER_ID),
            null
          );
        });
      });

      describe('#bttnioSubdomainFromMerchantId', function() {
        beforeEach(function() {
          const webToAppMappings = [
            { subdomain_name: 'bleep', organization: PUBLISHER_ID },
            {
              subdomain_name: 'bloop',
              organization: 'org-3573c6b896624279',
              external_host: 'https://www.bloop.com',
            },
            { subdomain_name: 'blorp', organization: 'org-YYY' },
          ];

          const approvals = [
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-3573c6b896624279',
            },
          ];

          this.config = createConfig(
            [],
            [],
            [],
            [],
            webToAppMappings,
            approvals
          );
        });

        it('returns a subdomain for a known merchant', function() {
          assert.equal(
            this.config.bttnioSubdomainFromMerchantId('org-3573c6b896624279'),
            'bloop'
          );
        });

        it('returns null for unknown merchant', function() {
          assert.equal(
            this.config.bttnioSubdomainFromMerchantId('org-xxx'),
            null
          );
        });
      });

      describe('#merchantIdFromWebToAppMappings', function() {
        beforeEach(function() {
          const webToAppMappings = [
            { subdomain_name: 'bleep', organization: PUBLISHER_ID },
            {
              subdomain_name: 'bloop',
              organization: 'org-3573c6b896624279',
              external_host: 'https://www.bloop.com',
            },
            { subdomain_name: 'blorp', organization: 'org-YYY' },
          ];

          const approvals = [
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-3573c6b896624279',
            },
          ];

          this.config = createConfig(
            [],
            [],
            [],
            [],
            webToAppMappings,
            approvals
          );
        });

        it('returns a merchant id for a known subdomain', function() {
          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'bloop.bttn.io',
              '',
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'bloop.bttn.io',
              '/2',
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'track.bttn.io',
              '/bloop',
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'track.bttn.io',
              '/bloop/2',
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );
        });

        it('returns null for unknown subdomains', function() {
          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'bloop.bleep.bttn.io',
              '',
              PUBLISHER_ID
            ),
            null
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'blop.bttn.io',
              '',
              PUBLISHER_ID
            ),
            null
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'blop.bttn.io',
              '/bloop/2',
              PUBLISHER_ID
            ),
            null
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'track.bttn.io',
              '/blop/bloop/2',
              PUBLISHER_ID
            ),
            null
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'track.bttn.io',
              '/',
              PUBLISHER_ID
            ),
            null
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'track.bttn.io',
              '',
              PUBLISHER_ID
            ),
            null
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'track.bttn.iop/bloop',
              '/',
              PUBLISHER_ID
            ),
            null
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'bloop.bttn.iop',
              '/',
              PUBLISHER_ID
            ),
            null
          );

          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'pavel.com',
              '/',
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns null for a bad config', function() {
          assert.equal(
            this.config.merchantIdFromWebToAppMappings(
              'track.bttn.io',
              '/',
              PUBLISHER_ID
            ),
            null
          );
        });
      });

      describe('#merchantIdFromSupportedAffiliates', function() {
        beforeEach(function() {
          const supportedMerchants = [
            { hostname: 'bloop.com', organization_id: 'org-3573c6b896624279' },
            {
              hostname: 'bloop.co.uk',
              organization_id: 'org-3573c6b896624279',
            },
          ];

          const supportedAffiliateQueryIds = [
            {
              hostname: 'linksynergy.com',
              key: 'mid',
              value: '123',
              organization_id: PUBLISHER_ID,
            },
            {
              hostname: 'linksynergy.com',
              key: 'mid',
              value: '456',
              organization_id: 'org-3573c6b896624279',
            },
            {
              hostname: 'linksynergy.com',
              key: 'mid',
              value: '678',
              organization_id: 'org-YYY',
            },
          ];

          const supportedAffiliatePathnameIds = [
            {
              hostname: 'click.linksynergy.com',
              regex: String.raw`pavel`,
              matches: [],
            },
            {
              hostname: 'quidco.com',
              regex: String.raw`(?:^|\/)(?:\w{1,}-)?visit\/(\w{2})-(\d{1,})(?:$|\/.*)`,
              matches: [
                {
                  values: ['US', '4567'],
                  organization_id: 'org-3573c6b896624279',
                  url: 'https://www.bloop.com',
                },
                {
                  values: ['UK', '666'],
                  organization_id: 'org-3573c6b896624279',
                  url: 'https://www.bloop.co.uk',
                },
              ],
            },
            {
              hostname: 'vouchercloud.com',
              regex: String.raw`(?:^|\/)(\w{1,})\/(\w{1,})\/\d{1,}(?:$|\/.*)`,
              matches: [
                {
                  values: ['out', 'offer'],
                  organization_id: null,
                  url: null,
                },
              ],
            },
          ];

          const supportedAffiliates = [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [],
            },
            {
              hostname: 'linksynergy.com',
              query_url_keys: [
                { key: 'wurl' },
                { key: 'url' },
                { key: 'kurl' },
              ],
            },
            {
              hostname: 'bloop.linksynergy.com',
              query_url_keys: [],
            },
            {
              hostname: 'quidco.com',
              query_url_keys: [],
            },
            {
              hostname: 'vouchercloud.com',
              query_url_keys: [],
            },
          ];

          const approvals = [
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-3573c6b896624279',
            },
          ];

          this.config = createConfig(
            supportedMerchants,
            supportedAffiliateQueryIds,
            supportedAffiliatePathnameIds,
            supportedAffiliates,
            [],
            approvals
          );
        });

        it('returns null for a non matching affiliate', function() {
          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'bloopaffiliates.com',
              '',
              { wurl: 'https://bloop.com/2?query=true#bleep' },
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns null for a non matching affiliate', function() {
          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'bloopaffiliates.com',
              '',
              { wurl: 'https://bloop.com/2?query=true#bleep' },
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns a merchant Id with a matching query url', function() {
          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              { url: 'https://bloop.com/?query=true#bleep' },
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              {
                wurl: 'https://bloop.com/?query=true#bleep',
                bleep: '2',
              },
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              { wurl: 'https://bloop.com/?query=true#bleep' },
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              { wurl: 'https://bloop.com/2?query=true#bleep' },
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'www.linksynergy.com',
              '',
              { url: 'https://bloop.com/?query=true#bleep' },
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'www.linksynergy.com',
              '',
              { url: 'https://www.bloop.com/?query=true#bleep' },
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );
        });

        it('returns null for a non matching query url', function() {
          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              { wurl: 'https://bleep.com/2?query=true#bleep' },
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns null for a non matching query url or id', function() {
          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              {},
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns a merchant Id with a matching query id', function() {
          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              { mid: '456' },
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'www.linksynergy.com',
              '',
              { mid: '456' },
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );
        });

        it('returns null for a non matching query id', function() {
          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              { mid: '666' },
              PUBLISHER_ID
            ),
            null
          );

          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              { bleep: '456' },
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns a merchant Id with a matching pathname', function() {
          assert.deepEqual(
            this.config.merchantIdFromSupportedAffiliates(
              'quidco.com',
              '/visit/US-4567/bloop',
              {},
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.deepEqual(
            this.config.merchantIdFromSupportedAffiliates(
              'wWw.quidco.com',
              '/visit/US-4567/bloop',
              {},
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.deepEqual(
            this.config.merchantIdFromSupportedAffiliates(
              'wWw.quidco.com',
              '/api-visit/US-4567/bloop',
              {},
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.deepEqual(
            this.config.merchantIdFromSupportedAffiliates(
              'wWw.quidco.com',
              '/mobile-visit/US-4567/bloop',
              {},
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );

          assert.deepEqual(
            this.config.merchantIdFromSupportedAffiliates(
              'quidco.com',
              '/visit/UK-666/bloop',
              {},
              PUBLISHER_ID
            ),
            'org-3573c6b896624279'
          );
        });

        it('returns a null merchant id with a matching pathname that requires unwinding', function() {
          assert.deepEqual(
            this.config.merchantIdFromSupportedAffiliates(
              'vouchercloud.com',
              '/out/offer/1478624',
              {},
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns null with a non-matching pathname', function() {
          assert.deepEqual(
            this.config.merchantIdFromSupportedAffiliates(
              'quidco.com',
              '/visit/UK-4567/bloop',
              {},
              PUBLISHER_ID
            ),
            null
          );

          assert.deepEqual(
            this.config.merchantIdFromSupportedAffiliates(
              'quidco.com',
              '/VISIT/US-4567/bloop',
              {},
              PUBLISHER_ID
            ),
            null
          );

          assert.deepEqual(
            this.config.merchantIdFromSupportedAffiliates(
              'quidco.com',
              '/visit/US-w4567/bloop',
              {},
              PUBLISHER_ID
            ),
            null
          );
        });

        it('returns null for a bad config', function() {
          assert.equal(
            this.config.merchantIdFromSupportedAffiliates(
              'linksynergy.com',
              '',
              {}
            ),
            null,
            PUBLISHER_ID
          );
        });
      });

      describe('#destinationUrlFromBttnioUrl', function() {
        beforeEach(function() {
          const webToAppMappings = [
            {
              subdomain_name: 'bloop',
              organization: 'org-3573c6b896624279',
              external_host: 'http://bloop.com',
            },
          ];

          const approvals = [
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-3573c6b896624279',
            },
          ];

          this.config = createConfig(
            [],
            [],
            [],
            [],
            webToAppMappings,
            approvals
          );
        });

        it('returns a destination for standard bttnio links', function() {
          assert.deepEqual(
            this.config.destinationUrlFromBttnioUrl('https://bloop.bttn.io/'),
            'http://bloop.com/'
          );

          assert.deepEqual(
            this.config.destinationUrlFromBttnioUrl('https://bloop.bttn.io/1'),
            'http://bloop.com/1'
          );

          assert.deepEqual(
            this.config.destinationUrlFromBttnioUrl(
              'https://bloop.bttn.io/1/2?q=2&b=false#anchor'
            ),
            'http://bloop.com/1/2?q=2&b=false#anchor'
          );
        });

        it('returns a destination for track bttnio links', function() {
          assert.deepEqual(
            this.config.destinationUrlFromBttnioUrl(
              'https://track.bttn.io/bloop'
            ),
            'http://bloop.com/'
          );

          assert.deepEqual(
            this.config.destinationUrlFromBttnioUrl(
              'https://track.bttn.io/bloop/'
            ),
            'http://bloop.com/'
          );

          assert.deepEqual(
            this.config.destinationUrlFromBttnioUrl(
              'https://track.bttn.io/bloop/1'
            ),
            'http://bloop.com/1'
          );

          assert.deepEqual(
            this.config.destinationUrlFromBttnioUrl(
              'https://track.bttn.io/bloop/1/2/3?q=2&b=false#anchor'
            ),
            'http://bloop.com/1/2/3?q=2&b=false#anchor'
          );
        });

        it(`returns null for links that don't match`, function() {
          assert.equal(
            this.config.destinationUrlFromBttnioUrl(
              'https://bloop.bleep.bttn.io'
            ),
            null
          );

          assert.equal(
            this.config.destinationUrlFromBttnioUrl('https://track.bttn.io'),
            null
          );

          assert.equal(
            this.config.destinationUrlFromBttnioUrl('https://track.bttn.io/'),
            null
          );

          assert.equal(
            this.config.destinationUrlFromBttnioUrl(
              'https://track.bttn.iop/bloop'
            ),
            null
          );

          assert.equal(
            this.config.destinationUrlFromBttnioUrl('https://bloop.bttn.iop'),
            null
          );

          assert.equal(
            this.config.destinationUrlFromBttnioUrl('https://pavel.com'),
            null
          );
        });
      });

      describe('#destinationUrlFromAffiliateUrl', function() {
        beforeEach(function() {
          const supportedAffiliatePathnameIds = [
            {
              hostname: 'quidco.com',
              regex: String.raw`(?:^|\/)visit\/(\w{2})-(\d{1,})(?:$|\/.*)`,
              matches: [
                {
                  values: ['US', '4567'],
                  organization_id: 'org-3573c6b896624279',
                  url: 'https://www.pup.com',
                },
              ],
            },
          ];

          const supportedAffiliates = [
            {
              hostname: 'bloop.com',
              query_url_keys: [],
            },
            {
              hostname: 'linksynergy.com',
              query_url_keys: [{ key: 'url' }],
            },
            {
              hostname: 'quidco.com',
              query_url_keys: [],
            },
          ];

          const approvals = [
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-3573c6b896624279',
            },
          ];

          this.config = createConfig(
            [],
            [],
            supportedAffiliatePathnameIds,
            supportedAffiliates,
            [],
            approvals
          );
        });

        it('unwraps an affiliate link url', function() {
          assert.equal(
            this.config.destinationUrlFromAffiliateUrl(
              'https://linksynergy.com/2?bloop=true&url=https%3A%2F%2Fbloop.net%3Fq%3D2'
            ),
            'https://bloop.net?q=2'
          );
        });

        it('unwraps an affiliate link url by pathname', function() {
          assert.equal(
            this.config.destinationUrlFromAffiliateUrl(
              'https://quidco.com/visit/US-4567'
            ),
            'https://www.pup.com'
          );
        });

        it('returns null for matching affiliate links with no destination url', function() {
          assert.equal(
            this.config.destinationUrlFromAffiliateUrl(
              'https://linksynergy.com/2?bloop=true&wurl=https%3A%2F%2Fbloop.net%3Fq%3D2'
            ),
            null
          );
        });

        it('returns null with a bad config', function() {
          assert.equal(
            createConfig().destinationUrlFromAffiliateUrl(
              'https://linksynergy.com/2?bloop=true&url=https%3A%2F%2Fbloop.net%3Fq%3D2'
            ),
            null
          );
        });

        it('returns null with a no match', function() {
          assert.equal(
            this.config.destinationUrlFromAffiliateUrl(
              'https://bleep.com/2?bloop=true&wurl=https%3A%2F%2Fbloop.net%3Fq%3D2'
            ),
            null
          );
        });
      });

      describe('#createBuilder', function() {
        beforeEach(function() {
          const approvals = [
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-3573c6b896624279',
            },
          ];

          this.config = createConfig([], [], [], [], [], approvals);
        });

        it('returns a support merchant builder', function() {
          const builder = this.config.createBuilder(
            PUBLISHER_ID,
            'org-3573c6b896624279'
          );
          assert.equal(typeof builder, 'object');
        });

        it('throws for an unsupported merchant', function() {
          assert.throws(() => {
            this.config.createBuilder(PUBLISHER_ID, 'org-YYY');
          }, Error);
        });

        it('throws for an unapproved merchant', function() {
          assert.throws(() => {
            this.config.createBuilder('org-YYY', 'org-3573c6b896624279');
          }, Error);
        });
      });

      describe('#createBuilderByUrl', function() {
        beforeEach(function() {
          const supportedMerchants = [
            { hostname: 'bloop.com', organization_id: 'org-3573c6b896624279' },
          ];

          const supportedAffiliateQueryIds = [
            {
              hostname: 'click.linksynergy.com',
              key: 'id',
              value: 'bleep',
              organization_id: 'org-3573c6b896624279',
              url: 'https://bloop.com',
            },
          ];

          const supportedAffiliatePathnameIds = [
            {
              hostname: 'click.linksynergy.com',
              regex: String.raw`pavel`,
              matches: [],
            },
            {
              hostname: 'quidco.com',
              regex: String.raw`(?:^|\/)visit\/(\w{2})-(\d{1,})(?:$|\/.*)`,
              matches: [
                {
                  values: ['US', '4567'],
                  organization_id: 'org-3573c6b896624279',
                  url: 'https://www.bloop.com',
                },
                {
                  values: ['UK', '666'],
                  organization_id: 'org-3573c6b896624279',
                  url: 'https://www.bloop.co.uk',
                },
              ],
            },
          ];

          const supportedAffiliates = [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'wurl' }, { key: 'url' }],
            },
          ];

          const webToAppMappings = [
            {
              subdomain_name: 'bloop',
              organization: 'org-3573c6b896624279',
              external_host: 'https://bloop.com',
            },
          ];

          const approvals = [
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-3573c6b896624279',
            },
          ];

          this.config = createConfig(
            supportedMerchants,
            supportedAffiliateQueryIds,
            supportedAffiliatePathnameIds,
            supportedAffiliates,
            webToAppMappings,
            approvals
          );
        });

        it('returns a merchant with a matching hostname', function() {
          let builder = this.config.createBuilderByUrl(
            PUBLISHER_ID,
            'http://bloop.com'
          );
          assert.equal(typeof builder, 'object');

          builder = this.config.createBuilderByUrl(
            PUBLISHER_ID,
            'http://BLOOP.com'
          );
          assert.equal(typeof builder, 'object');
        });

        it('returns a merchant with a matching subdomain', function() {
          let builder = this.config.createBuilderByUrl(
            PUBLISHER_ID,
            'http://bloop.bttn.io/2?q=true'
          );
          assert.equal(typeof builder, 'object');

          builder = this.config.createBuilderByUrl(
            PUBLISHER_ID,
            'http://track.bttn.io/bloop/2?q=true'
          );
          assert.equal(typeof builder, 'object');
        });

        it('returns a merchant with a matching affiliate redirect', function() {
          let builder = this.config.createBuilderByUrl(
            PUBLISHER_ID,
            'http://click.linksynergy.com/2?q=true&url=http%3A%2F%2Fbloop.com'
          );
          assert.equal(typeof builder, 'object');

          builder = this.config.createBuilderByUrl(
            PUBLISHER_ID,
            'http://click.LINKSYNERGY.com/2?q=true&url=http%3A%2F%2FBLOOP.com'
          );
          assert.equal(typeof builder, 'object');
        });

        it('returns a merchant with a matching affiliate-namespaced query id', function() {
          const builder = this.config.createBuilderByUrl(
            PUBLISHER_ID,
            'http://click.linksynergy.com/2?q=true&id=bleep'
          );
          assert.equal(typeof builder, 'object');
        });

        it('returns a merchant with a matching affiliate-namespaced pathname id', function() {
          const builder = this.config.createBuilderByUrl(
            PUBLISHER_ID,
            'http://quidco.com/visit/US-4567'
          );
          assert.equal(typeof builder, 'object');
        });

        it('throws for an unsupported url', function() {
          assert.throws(() => {
            this.config.createBuilderByUrl(PUBLISHER_ID, 'http://bleep.org');
          }, Error);
        });

        it('throws for an unapproved merchant', function() {
          assert.throws(() => {
            this.config.createBuilderByUrl('org-YYY', 'http://bloop.com');
          }, Error);
        });
      });

      describe('#merchantIdByUrl', function() {
        beforeEach(function() {
          const supportedMerchants = [
            { hostname: 'bloop.com', organization_id: 'org-3573c6b896624279' },
            { hostname: 'pup.net', organization_id: 'org-PUP' },
          ];

          const supportedAffiliateQueryIds = [
            {
              hostname: 'click.linksynergy.com',
              key: 'id',
              value: 'bleep',
              organization_id: 'org-3573c6b896624279',
              url: 'http://bloop.com',
            },
          ];

          const supportedAffiliatePathnameIds = [
            {
              hostname: 'click.linksynergy.com',
              regex: String.raw`pavel`,
              matches: [],
            },
            {
              hostname: 'quidco.com',
              regex: String.raw`(?:^|\/)visit\/(\w{2})-(\d{1,})(?:$|\/.*)`,
              matches: [
                {
                  values: ['US', '4567'],
                  organization_id: 'org-3573c6b896624279',
                  url: 'https://www.bloop.com',
                },
                {
                  values: ['UK', '666'],
                  organization_id: 'org-3573c6b896624279',
                  url: 'https://www.bloop.co.uk',
                },
              ],
            },
          ];

          const supportedAffiliates = [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'wurl' }, { key: 'url' }],
            },
          ];

          const webToAppMappings = [
            {
              subdomain_name: 'bloop',
              organization: 'org-3573c6b896624279',
              external_host: 'http://bloop.com',
            },
            {
              subdomain_name: 'pup',
              organization: 'org-PUP',
              external_host: 'http://pup.net',
            },
          ];

          const approvals = [
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-3573c6b896624279',
            },
            {
              status: 'approved',
              audience: PUBLISHER_ID,
              organization: 'org-PUP',
            },
          ];

          this.config = createConfig(
            supportedMerchants,
            supportedAffiliateQueryIds,
            supportedAffiliatePathnameIds,
            supportedAffiliates,
            webToAppMappings,
            approvals
          );
        });

        it('returns a merchant id with a matching hostname', function() {
          let merchantId = this.config.merchantIdByUrl('http://bloop.com');
          assert.equal(merchantId, 'org-3573c6b896624279');

          merchantId = this.config.merchantIdByUrl('http://BLOOP.com');
          assert.equal(merchantId, 'org-3573c6b896624279');
        });

        it('returns a merchant with a matching subdomain', function() {
          let merchantId = this.config.merchantIdByUrl(
            'http://bloop.bttn.io/2?q=true'
          );
          assert.equal(merchantId, 'org-3573c6b896624279');

          merchantId = this.config.merchantIdByUrl(
            'http://track.bttn.io/bloop/2?q=true'
          );
          assert.equal(merchantId, 'org-3573c6b896624279');
        });

        it('returns a merchant with a matching affiliate redirect', function() {
          let merchantId = this.config.merchantIdByUrl(
            'http://click.linksynergy.com/2?q=true&url=http%3A%2F%2Fbloop.com'
          );
          assert.equal(merchantId, 'org-3573c6b896624279');

          merchantId = this.config.merchantIdByUrl(
            'http://click.LINKSYNERGY.com/2?q=true&url=http%3A%2F%2FBLOOP.com'
          );
          assert.equal(merchantId, 'org-3573c6b896624279');
        });

        it('returns a merchant with a matching affiliate-namespaced query id', function() {
          const merchantId = this.config.merchantIdByUrl(
            'http://click.linksynergy.com/2?q=true&id=bleep'
          );
          assert.equal(merchantId, 'org-3573c6b896624279');
        });

        it('returns a merchant with a matching affiliate-namespaced pathname id', function() {
          const merchantId = this.config.merchantIdByUrl(
            'http://quidco.com/visit/US-4567/bloop/bleep'
          );
          assert.equal(merchantId, 'org-3573c6b896624279');
        });

        it('returns null for an unsupported url', function() {
          assert.equal(this.config.merchantIdByUrl('http://bleep.org'), null);
        });

        it('returns the merchant id for an approved merchant', function() {
          assert.equal(
            this.config.merchantIdByUrl('http://bloop.com'),
            'org-3573c6b896624279'
          );
        });
      });

      describe('#supportedAffiliateByUrl', function() {
        beforeEach(function() {
          this.supportedAffiliates = [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'wurl' }, { key: 'url' }],
            },
          ];

          this.config = createConfig([], [], [], this.supportedAffiliates);
        });

        it('returns the affiliate matched by a url', function() {
          assert.deepEqual(
            this.config.supportedAffiliateByUrl(
              'https://click.linksynergy.com'
            ),
            this.supportedAffiliates[0]
          );

          assert.deepEqual(
            this.config.supportedAffiliateByUrl(
              'https://CLICK.linksynergy.com'
            ),
            this.supportedAffiliates[0]
          );
        });

        it('returns null if not found', function() {
          assert.deepEqual(
            this.config.supportedAffiliateByUrl(
              'https://bloop.linksynergy.com'
            ),
            null
          );
        });
      });

      describe('#shouldRedirectByUrl', function() {
        beforeEach(function() {
          this.supportedAffiliatePathnameIds = [
            {
              hostname: 'groupon.com',
              regex: String.raw`(?:^|\/)visit\/(\d{1,})\/(\d{1,})(?:$|\/.*)`,
              redirect: false,
              matches: [
                {
                  values: ['123', '456'],
                  organization_id: null,
                  url: null,
                },
              ],
            },
            {
              hostname: 'groupon.com',
              regex: String.raw`(?:^|\/)redirect\/(\d{1,})(?:$|\/.*)`,
              redirect: true,
              matches: [
                {
                  values: ['123'],
                  organization_id: null,
                  url: null,
                },
              ],
            },
            {
              hostname: 'bloopon.com',
              regex: String.raw`(?:^|\/)visit\/(\d{1,})\/(\d{1,})(?:$|\/.*)`,
              redirect: true,
              matches: [
                {
                  values: ['123', '456'],
                  organization_id: null,
                  url: null,
                },
              ],
            },
          ];

          this.supportedAffiliates = [
            {
              hostname: 'groupon.com',
              query_url_keys: [],
            },
            {
              hostname: 'bloopon.com',
              query_url_keys: [],
            },
          ];

          this.config = createConfig(
            [],
            [],
            this.supportedAffiliatePathnameIds,
            this.supportedAffiliates
          );
        });

        it('returns false for links with no match', function() {
          assert(!this.config.shouldRedirectByUrl('http://pup.net'));
          assert(!this.config.shouldRedirectByUrl('http://groupon.com'));
          assert(
            !this.config.shouldRedirectByUrl('http://groupon.com/visit/123/456')
          );
          assert(
            !this.config.shouldRedirectByUrl('http://groupon.com/redirect/456')
          );
          assert(
            !this.config.shouldRedirectByUrl('http://bloopon.com/visit/123/789')
          );
        });

        it('returns true for links that match', function() {
          assert(
            this.config.shouldRedirectByUrl('http://groupon.com/redirect/123')
          );
          assert(
            this.config.shouldRedirectByUrl(
              'http://groupon.com/redirect/123/bleep'
            )
          );
          assert(
            this.config.shouldRedirectByUrl('http://bloopon.com/visit/123/456')
          );
          assert(
            this.config.shouldRedirectByUrl(
              'http://bloopon.com/visit/123/456/blop'
            )
          );
        });
      });

      describe('#redirectCacheKey', function() {
        beforeEach(function() {
          this.supportedAffiliatePathnameIds = [
            {
              hostname: 'groupon.com',
              regex: String.raw`(?:^|\/)redirect\/(\d{1,})(?:$|\/.*)`,
              redirect: true,
              matches: [
                {
                  values: ['123'],
                  organization_id: null,
                  url: null,
                },
              ],
            },
            {
              hostname: 'bloopon.com',
              regex: String.raw`(?:^|\/)visit\/(\d{1,})\/(\d{1,})(?:$|\/.*)`,
              redirect: true,
              getCacheKey: url =>
                crypto.createHash('sha1').update(url).digest('hex'),
              matches: [
                {
                  values: ['123', '456'],
                  organization_id: null,
                  url: null,
                },
              ],
            },
          ];

          this.supportedAffiliates = [
            {
              hostname: 'groupon.com',
              query_url_keys: [],
            },
            {
              hostname: 'bloopon.com',
              query_url_keys: [],
            },
          ];

          this.config = createConfig(
            [],
            [],
            this.supportedAffiliatePathnameIds,
            this.supportedAffiliates
          );
        });

        it('returns a default cache key', function() {
          assert.deepEqual(
            this.config.redirectCacheKey('http://groupon.com/redirect/123'),
            'groupon.com/redirect/123'
          );
        });

        it('returns a specialized cache key', function() {
          assert.deepEqual(
            this.config.redirectCacheKey('http://bloopon.com/visit/123/456'),
            'bd54d774036c7c69e2fb0bbc2abec1b4df525f10'
          );
        });
      });
    });
  });

  describe('config', function() {
    beforeEach(function() {
      const supportedMerchants = [
        { hostname: 'pup.com', organization_id: PUBLISHER_ID },
        { hostname: 'radiohead.com', organization_id: 'org-YYY' },
        { hostname: 'wasteheadquarters.com', organization_id: 'org-YYY' },
        { hostname: 'radiohead.co.uk', organization_id: 'org-YYY' },
        { hostname: 'cloudnothings.com', organization_id: 'org-ZZZ' },
      ];

      const supportedAffiliateQueryIds = [
        {
          hostname: 'click.linksynergy.com',
          key: 'id',
          value: 'bloop',
          organization_id: 'org-YYY',
        },
        {
          hostname: 'click.linksynergy.com',
          key: 'id',
          value: 'bloop2',
          organization_id: 'org-YYY',
        },
        {
          hostname: 'click.linksynergy.com',
          key: 'sid',
          value: 'bloop2',
          organization_id: 'org-YYY',
        },
        {
          hostname: 'click.linksynergy.com',
          key: 'id',
          value: 'bloop3',
          organization_id: 'org-ZZZ',
        },
        {
          hostname: 'linksynergy.com',
          key: 'id',
          value: 'bloop2',
          organization_id: PUBLISHER_ID,
        },
      ];

      const supportedAffiliatePathnameIds = [
        {
          hostname: 'click.linksynergy.com',
          regex: '(?:^|/)bloop/(d{1,})(?:$|/.*)',
          redirect: false,
          matches: [
            { values: [1989], organization_id: 'org-YYY' },
            { values: [2001], organization_id: 'org-ZZZ' },
          ],
        },
        {
          hostname: 'groupon.com',
          regex: `/(.*)/`,
          redirect: true,
          matches: [{ values: ['bloop'], organization_id: null }],
        },
      ];

      const supportedAffiliates = [
        {
          hostname: 'click.linksynergy.com',
          query_url_keys: [{ key: 'murl' }],
        },
        {
          hostname: 'linksynergy.com',
          query_url_keys: [{ key: 'url' }],
        },
        {
          hostname: 'groupon.com',
          query_url_keys: [],
        },
      ];

      const webToAppMappings = [
        {
          id: 1,
          subdomain_name: 'pup',
          organization: PUBLISHER_ID,
          external_host: 'https://www.pup.com',
        },
        {
          id: 2,
          subdomain_name: 'radiohead',
          organization: 'org-YYY',
          external_host: 'https://www.radiohead.com',
        },
        {
          id: 3,
          subdomain_name: 'cloudnothings',
          organization: 'org-ZZZ',
          external_host: 'https://www.cloudnothings.com',
        },
        {
          id: 4,
          subdomain_name: 'twinpeaks',
          organization: 'org-WWW',
          external_host: 'https://www.twinpeaks.com',
        },
        {
          id: 5,
          subdomain_name: 'blabla',
          organization: 'org-QQQ',
          external_host: 'https://www.blabla.com',
        },
        {
          id: 6,
          subdomain_name: 'cloudnothingsuk',
          organization: 'org-ZZZ',
          external_host: 'https://www.cloudnothings.co.uk',
        },
      ];

      const approvals = [
        {
          id: 1,
          status: 'pending',
          organization: 'org-YYY',
          audience: 'org-PP0',
        },
        {
          id: 2,
          status: 'approved',
          organization: PUBLISHER_ID,
          audience: 'org-PP0',
        },
        {
          id: 3,
          status: 'approved',
          organization: 'org-ZZZ',
          audience: 'org-PP0',
        },
        {
          id: 4,
          status: 'approved',
          organization: 'org-YYY',
          audience: 'org-PP1',
        },
        {
          id: 5,
          status: 'approved',
          organization: 'org-WWW',
          audience: 'org-PP0',
        },
        {
          id: 6,
          status: 'approved',
          organization: 'org-QQQ',
          audience: 'org-PP4',
        },
      ];

      this.config = new KokiriConfig(
        supportedMerchants,
        supportedAffiliateQueryIds,
        supportedAffiliatePathnameIds,
        supportedAffiliates,
        webToAppMappings,
        approvals
      );
    });

    it('is idempotent with many hydrations', function() {
      const expected = this.config.toModuleConfig('org-PPO');
      const hydrated = KokiriConfig.fromModuleConfig(expected);

      assert.deepEqual(expected, hydrated.toModuleConfig('org-PP0'));
    });

    describe('#toModuleConfig', function() {
      it('returns a module config', function() {
        assert.deepEqual(this.config.toModuleConfig('org-PP0'), {
          supported_merchants: [
            {
              hostname: 'pup.com',
              organization_id: PUBLISHER_ID,
            },
            {
              hostname: 'cloudnothings.com',
              organization_id: 'org-ZZZ',
            },
          ],
          supported_affiliate_query_ids: [
            {
              hostname: 'click.linksynergy.com',
              key: 'id',
              value: 'bloop3',
              organization_id: 'org-ZZZ',
            },
            {
              hostname: 'linksynergy.com',
              key: 'id',
              value: 'bloop2',
              organization_id: PUBLISHER_ID,
            },
          ],
          supported_affiliate_pathname_ids: [
            {
              hostname: 'click.linksynergy.com',
              regex: '(?:^|/)bloop/(d{1,})(?:$|/.*)',
              redirect: false,
              matches: [{ values: ['2001'], organization_id: 'org-ZZZ' }],
            },
            {
              hostname: 'groupon.com',
              regex: '/(.*)/',
              redirect: true,
              matches: [{ values: ['bloop'], organization_id: null }],
            },
          ],
          supported_affiliates: [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'murl' }],
            },
            {
              hostname: 'linksynergy.com',
              query_url_keys: [{ key: 'url' }],
            },
            {
              hostname: 'groupon.com',
              query_url_keys: [],
            },
          ],
          web_to_app_mappings: [
            {
              id: 1,
              subdomain_name: 'pup',
              organization: PUBLISHER_ID,
              external_host: 'https://www.pup.com',
            },
            {
              id: 3,
              subdomain_name: 'cloudnothings',
              organization: 'org-ZZZ',
              external_host: 'https://www.cloudnothings.com',
            },
            {
              id: 4,
              subdomain_name: 'twinpeaks',
              organization: 'org-WWW',
              external_host: 'https://www.twinpeaks.com',
            },
            {
              id: 6,
              subdomain_name: 'cloudnothingsuk',
              organization: 'org-ZZZ',
              external_host: 'https://www.cloudnothings.co.uk',
            },
          ],
          approvals: [
            {
              id: 1,
              status: 'pending',
              organization: 'org-YYY',
              audience: 'org-PP0',
            },
            {
              id: 2,
              status: 'approved',
              organization: PUBLISHER_ID,
              audience: 'org-PP0',
            },
            {
              id: 3,
              status: 'approved',
              organization: 'org-ZZZ',
              audience: 'org-PP0',
            },
            {
              id: 5,
              status: 'approved',
              organization: 'org-WWW',
              audience: 'org-PP0',
            },
          ],
        });

        assert.deepEqual(this.config.toModuleConfig('org-PP1'), {
          supported_merchants: [
            {
              hostname: 'radiohead.com',
              organization_id: 'org-YYY',
            },
            {
              hostname: 'wasteheadquarters.com',
              organization_id: 'org-YYY',
            },
            {
              hostname: 'radiohead.co.uk',
              organization_id: 'org-YYY',
            },
          ],
          supported_affiliate_query_ids: [
            {
              hostname: 'click.linksynergy.com',
              key: 'id',
              value: 'bloop',
              organization_id: 'org-YYY',
            },
            {
              hostname: 'click.linksynergy.com',
              key: 'id',
              value: 'bloop2',
              organization_id: 'org-YYY',
            },
            {
              hostname: 'click.linksynergy.com',
              key: 'sid',
              value: 'bloop2',
              organization_id: 'org-YYY',
            },
          ],
          supported_affiliate_pathname_ids: [
            {
              hostname: 'click.linksynergy.com',
              regex: '(?:^|/)bloop/(d{1,})(?:$|/.*)',
              redirect: false,
              matches: [{ values: ['1989'], organization_id: 'org-YYY' }],
            },
            {
              hostname: 'groupon.com',
              regex: '/(.*)/',
              redirect: true,
              matches: [{ values: ['bloop'], organization_id: null }],
            },
          ],
          supported_affiliates: [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'murl' }],
            },
            {
              hostname: 'linksynergy.com',
              query_url_keys: [{ key: 'url' }],
            },
            {
              hostname: 'groupon.com',
              query_url_keys: [],
            },
          ],
          web_to_app_mappings: [
            {
              id: 2,
              subdomain_name: 'radiohead',
              organization: 'org-YYY',
              external_host: 'https://www.radiohead.com',
            },
          ],
          approvals: [
            {
              id: 4,
              status: 'approved',
              organization: 'org-YYY',
              audience: 'org-PP1',
            },
          ],
        });

        assert.deepEqual(this.config.toModuleConfig('org-PP3'), {
          supported_merchants: [],
          supported_affiliate_query_ids: [],
          supported_affiliate_pathname_ids: [
            {
              hostname: 'click.linksynergy.com',
              regex: '(?:^|/)bloop/(d{1,})(?:$|/.*)',
              redirect: false,
              matches: [],
            },
            {
              hostname: 'groupon.com',
              regex: '/(.*)/',
              redirect: true,
              matches: [{ values: ['bloop'], organization_id: null }],
            },
          ],
          supported_affiliates: [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'murl' }],
            },
            {
              hostname: 'linksynergy.com',
              query_url_keys: [{ key: 'url' }],
            },
            {
              hostname: 'groupon.com',
              query_url_keys: [],
            },
          ],
          web_to_app_mappings: [],
          approvals: [],
        });
      });
    });

    describe('#toSDKConfig', function() {
      it('returns an SDK config', function() {
        assert.deepEqual(this.config.toSDKConfig('org-PP0'), {
          supported_hostnames: [
            { hostname: 'pup.com' },
            { hostname: 'cloudnothings.com' },
          ],
          supported_bttnio_subdomains: [
            { subdomain: 'pup' },
            { subdomain: 'cloudnothings' },
            { subdomain: 'twinpeaks' },
            { subdomain: 'cloudnothingsuk' },
          ],
          supported_affiliates: [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'murl' }],
              query_ids: [
                {
                  key: 'id',
                  values: [{ value: 'bloop3' }],
                  guaranteed_action: true,
                },
              ],
              pathname_ids: [
                {
                  regex: '(?:^|/)bloop/(d{1,})(?:$|/.*)',
                  matches: [{ values: [2001] }],
                  guaranteed_action: true,
                },
              ],
            },
            {
              hostname: 'linksynergy.com',
              query_url_keys: [{ key: 'url' }],
              query_ids: [
                {
                  key: 'id',
                  values: [{ value: 'bloop2' }],
                  guaranteed_action: true,
                },
              ],
              pathname_ids: [],
            },
            {
              hostname: 'groupon.com',
              query_url_keys: [],
              query_ids: [],
              pathname_ids: [
                {
                  regex: '/(.*)/',
                  matches: [{ values: ['bloop'] }],
                  guaranteed_action: false,
                },
              ],
            },
          ],
        });

        assert.deepEqual(this.config.toSDKConfig('org-PP1'), {
          supported_hostnames: [
            { hostname: 'radiohead.com' },
            { hostname: 'wasteheadquarters.com' },
            { hostname: 'radiohead.co.uk' },
          ],
          supported_bttnio_subdomains: [{ subdomain: 'radiohead' }],
          supported_affiliates: [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'murl' }],
              query_ids: [
                {
                  key: 'id',
                  values: [{ value: 'bloop' }, { value: 'bloop2' }],
                  guaranteed_action: true,
                },
                {
                  key: 'sid',
                  values: [{ value: 'bloop2' }],
                  guaranteed_action: true,
                },
              ],
              pathname_ids: [
                {
                  regex: '(?:^|/)bloop/(d{1,})(?:$|/.*)',
                  matches: [{ values: [1989] }],
                  guaranteed_action: true,
                },
              ],
            },
            {
              hostname: 'linksynergy.com',
              query_url_keys: [{ key: 'url' }],
              query_ids: [],
              pathname_ids: [],
            },
            {
              hostname: 'groupon.com',
              query_url_keys: [],
              query_ids: [],
              pathname_ids: [
                {
                  regex: '/(.*)/',
                  matches: [{ values: ['bloop'] }],
                  guaranteed_action: false,
                },
              ],
            },
          ],
        });

        assert.deepEqual(this.config.toSDKConfig('org-PP3'), {
          supported_hostnames: [],
          supported_bttnio_subdomains: [],
          supported_affiliates: [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'murl' }],
              query_ids: [],
              pathname_ids: [
                {
                  regex: '(?:^|/)bloop/(d{1,})(?:$|/.*)',
                  matches: [],
                  guaranteed_action: true,
                },
              ],
            },
            {
              hostname: 'linksynergy.com',
              query_url_keys: [{ key: 'url' }],
              query_ids: [],
              pathname_ids: [],
            },
            {
              hostname: 'groupon.com',
              query_url_keys: [],
              query_ids: [],
              pathname_ids: [
                {
                  regex: '/(.*)/',
                  matches: [{ values: ['bloop'] }],
                  guaranteed_action: false,
                },
              ],
            },
          ],
        });

        assert.deepEqual(this.config.toSDKConfig('org-PP4'), {
          supported_hostnames: [],
          supported_bttnio_subdomains: [{ subdomain: 'blabla' }],
          supported_affiliates: [
            {
              hostname: 'click.linksynergy.com',
              query_url_keys: [{ key: 'murl' }],
              query_ids: [],
              pathname_ids: [
                {
                  regex: '(?:^|/)bloop/(d{1,})(?:$|/.*)',
                  matches: [],
                  guaranteed_action: true,
                },
              ],
            },
            {
              hostname: 'linksynergy.com',
              query_url_keys: [{ key: 'url' }],
              query_ids: [],
              pathname_ids: [],
            },
            {
              hostname: 'groupon.com',
              query_url_keys: [],
              query_ids: [],
              pathname_ids: [
                {
                  regex: '/(.*)/',
                  matches: [{ values: ['bloop'] }],
                  guaranteed_action: false,
                },
              ],
            },
          ],
        });
      });
    });
  });
});
