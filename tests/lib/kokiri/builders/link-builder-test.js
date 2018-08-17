const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');
const LinkBuilder = require('../../../../lib/kokiri/builders/link-builder');

// TODO(will): These tests shouldn't test base-class behavior with a derived
// class.
//
describe('lib/kokiri/builders/link-builder', function() {
  beforeEach(function() {
    const supportedAffiliates = [
      {
        hostname: 'linksynergy.com',
        query_url_keys: [{ key: 'url' }],
      },
    ];

    const supportedAffiliateQueryIds = [
      {
        hostname: 'linksynergy.com',
        key: 'id',
        value: 'bloop',
        url: 'http://bloop.com/bleep',
      },
    ];

    const webToAppMappings = [
      {
        organization: 'org-7edde2ff2a553edd',
        subdomain_name: 'bloop',
        external_host: 'https://bloop.com',
      },
    ];

    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-7edde2ff2a553edd',
      },
    ];

    const config = new KokiriConfig(
      [],
      supportedAffiliateQueryIds,
      [],
      supportedAffiliates,
      {
        webToAppMappings,
        approvals,
      }
    );

    this.builder = config.createBuilder('org-XXX', 'org-7edde2ff2a553edd');

    this.baseBuilder = new LinkBuilder({}, 'org-XXX', 'org-YYY');
  });

  describe('#destinationFromUrl', function() {
    it('returns a destination from a url', function() {
      assert.deepEqual(this.builder.destinationFromUrl('https://bloop.net'), {
        pathname: '/',
        query: {},
        hash: null,
      });

      assert.deepEqual(this.builder.destinationFromUrl(''), {
        pathname: null,
        query: {},
        hash: null,
      });

      assert.deepEqual(
        this.builder.destinationFromUrl('https://bloop.net/1/2?q=2#anchor'),
        {
          pathname: '/1/2',
          query: { q: '2' },
          hash: '#anchor',
        }
      );
    });

    it('returns a destination from a bttnio url', function() {
      assert.deepEqual(
        this.builder.destinationFromUrl('https://bloop.bttn.io/1/2?q=2#anchor'),
        {
          pathname: '/1/2',
          query: { q: '2' },
          hash: '#anchor',
        }
      );

      assert.deepEqual(
        this.builder.destinationFromUrl(
          'https://track.bttn.io/bloop/1/2?q=2#anchor'
        ),
        {
          pathname: '/1/2',
          query: { q: '2' },
          hash: '#anchor',
        }
      );
    });

    it('returns a destination from an affiliate url', function() {
      assert.deepEqual(
        this.builder.destinationFromUrl(
          'https://linksynergy.com?url=https%3A%2F%2Fbloop.net%2F1%2F2%3Fq%3D2%23anchor'
        ),
        {
          pathname: '/1/2',
          query: { q: '2' },
          hash: '#anchor',
        }
      );

      assert.deepEqual(
        this.builder.destinationFromUrl(
          'https://linksynergy.com/1/2/3?id=bloop'
        ),
        {
          pathname: '/bleep',
          query: {},
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

  describe('#attributeLink', function() {
    it('adds Button attribution to a url by default', function() {
      const url = 'https://merchant.com/1?product=123#anchor';

      assert.deepEqual(
        this.builder.attributeLink(url, 'srctok-XXX'),
        'https://merchant.com/1?product=123&btn_ref=srctok-XXX#anchor'
      );

      assert.deepEqual(url, 'https://merchant.com/1?product=123#anchor');
    });

    it('doesnt add Button attribution to a url if configured not to', function() {
      class AffiliateLinkBuilder extends LinkBuilder {}
      AffiliateLinkBuilder.HasButtonAffiliation = false;

      const nonButtonLinkBuilder = new AffiliateLinkBuilder(
        {},
        'org-XXX',
        'org-YYY'
      );

      const url = 'https://merchant.com/1?product=123#anchor';

      assert.deepEqual(
        this.builder.attributeLink(url, 'srctok-XXX'),
        'https://merchant.com/1?product=123&btn_ref=srctok-XXX#anchor'
      );

      assert.deepEqual(
        nonButtonLinkBuilder.attributeLink(url, 'srctok-XXX'),
        'https://merchant.com/1?product=123#anchor'
      );

      assert.deepEqual(url, 'https://merchant.com/1?product=123#anchor');
    });
  });

  describe('#getDestinationFromUrl', function() {
    it('defines a basic implementation of mapping a url to a destination', function() {
      assert.deepEqual(
        this.baseBuilder.getDestinationFromUrl(
          'https://www.pavel.net/1/2?q=a#hash'
        ),
        {
          pathname: '/1/2',
          query: { q: 'a' },
          hash: '#hash',
        }
      );
    });
  });
});
