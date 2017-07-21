const assert = require('assert');

const {
  parseUrl,
  joinPathname,
  cleanPathname,
  formatUrl,
  isHostnameMatch,
  isArrayMatch,
  normalizeHostname,
  attributeQuery,
  attributeLink,
  urlCacheKey,
} = require('../../../lib/kokiri/lib');

describe('lib/kokiri/lib', function() {
  describe('#parseUrl', function() {
    it('parses a url', function() {
      assert.deepEqual(
        parseUrl(
          'https://pavel:pw@bloop.bleep.net:4000/1/2?q=2&b=false#anchor'
        ),
        {
          protocol: 'https:',
          slashes: true,
          auth: 'pavel:pw',
          host: 'bloop.bleep.net:4000',
          port: 4000,
          hostname: 'bloop.bleep.net',
          hash: '#anchor',
          search: '?q=2&b=false',
          query: {
            q: '2',
            b: 'false',
          },
          pathname: '/1/2',
          path: '/1/2?q=2&b=false',
          href: 'https://pavel:pw@bloop.bleep.net:4000/1/2?q=2&b=false#anchor',
        }
      );

      assert.deepEqual(parseUrl('wat'), {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: null,
        search: '',
        query: {},
        pathname: 'wat',
        path: 'wat',
        href: 'wat',
      });
    });

    it('always returns an object', function() {
      assert.deepEqual(parseUrl(undefined), {});
      assert.deepEqual(parseUrl(null), {});
      assert.deepEqual(parseUrl(new Date()), {});
      assert.deepEqual(parseUrl([]), {});
      assert.deepEqual(parseUrl({}), {});
    });

    it('lower cases hostnames', function() {
      assert.deepEqual(parseUrl('http://BLOOP.NET').hostname, 'bloop.net');
    });
  });

  describe('#formatUrl', function() {
    it('formars a url', function() {
      assert.deepEqual(
        formatUrl({
          protocol: 'http',
          hostname: 'bloop.bleep',
          pathname: '1',
          query: { a: 2 },
          hash: 'pavel',
        }),
        'http://bloop.bleep/1?a=2#pavel'
      );

      assert.deepEqual(
        formatUrl({
          protocol: 'http',
          hostname: 'bloop.bleep',
          pathname: '/1/2/',
        }),
        'http://bloop.bleep/1/2'
      );

      assert.deepEqual(
        formatUrl({ protocol: 'http', hostname: 'bloop.bleep', pathname: '/' }),
        'http://bloop.bleep'
      );
    });

    it('normalizes pathnames', function() {
      assert.deepEqual(
        formatUrl({
          protocol: 'http',
          hostname: 'bloop.bleep',
          pathname: '//1/2///3///',
        }),
        'http://bloop.bleep/1/2/3'
      );

      assert.deepEqual(
        formatUrl(
          {
            protocol: 'http',
            hostname: 'bloop.bleep',
            pathname: '//1/2///3///',
          },
          false
        ),
        'http://bloop.bleep//1/2///3///'
      );

      assert.deepEqual(
        formatUrl({
          protocol: 'http',
          hostname: 'bloop.bleep',
          pathname: '1/2',
        }),
        'http://bloop.bleep/1/2'
      );
    });
  });

  describe('#joinPathname', function() {
    it('joins an array into a pathname', function() {
      assert.deepEqual(joinPathname([1, '2', 'three']), '1/2/three');
      assert.deepEqual(joinPathname([1, '2', null, 'three']), '1/2/three');
    });
  });

  describe('#cleanPathname', function() {
    it('cleans a pathname', function() {
      assert.deepEqual(cleanPathname(null), '');
      assert.deepEqual(cleanPathname(''), '');
      assert.deepEqual(cleanPathname('/1'), '1');
      assert.deepEqual(cleanPathname('//1'), '1');
      assert.deepEqual(cleanPathname('//1//1///'), '1/1');
    });
  });

  describe('#formatUrl', function() {
    it('formats a url', function() {
      assert.deepEqual(
        formatUrl({
          protocol: 'http',
          hostname: 'bloop',
          pathname: '2',
          query: { a: true },
          anchor: 'pavel',
        }),
        'http://bloop/2?a=true'
      );

      assert.deepEqual(formatUrl({}), '');
    });

    it('formats a url and cleans the pathname', function() {
      assert.deepEqual(
        formatUrl({
          protocol: 'http',
          hostname: 'bloop',
          pathname: '2//2',
          query: { a: true },
          anchor: 'pavel',
        }),
        'http://bloop/2/2?a=true'
      );
    });
  });

  describe('#isHostnameMatch', function() {
    it('returns true if two hostnames match and false otherwise', function() {
      assert(isHostnameMatch('bloop.net', 'bloop.net'));
      assert(isHostnameMatch('www.bloop.net', 'bloop.net'));
      assert(isHostnameMatch('www.bloop.net', 'www.bloop.net'));
      assert(isHostnameMatch('bloop.net', 'www.bloop.net'));
      assert(isHostnameMatch('BLOOP.net', 'BLOOP.net'));
      assert(isHostnameMatch('www.BLOOP.net', 'BLOOP.net'));
      assert(isHostnameMatch('www.BLOOP.net', 'bloop.net'));
    });
  });

  describe('#isArrayMatch', function() {
    it('returns true if two arrays match', function() {
      assert(isArrayMatch([1, 2, 3], [1, 2, 3]));
      assert(isArrayMatch([], []));
      assert(isArrayMatch(['hello'], ['hello']));
      assert(!isArrayMatch([1, 2, 3], null));
      assert(!isArrayMatch([1, 2, 3], undefined));
      assert(!isArrayMatch([1, 2, 3], {}));
      assert(!isArrayMatch([1, 2, 3], []));
      assert(!isArrayMatch([1, 2, 3], [1]));
      assert(!isArrayMatch([1, 2, 3], [1, 2]));
      assert(!isArrayMatch([1, 2, 3], [1, 2, 4]));
      assert(!isArrayMatch([1, 2, 3], [1, 2, 3, 5]));
      assert(!isArrayMatch([{}], [{}]));
    });
  });

  describe('#normalizeHostname', function() {
    it('strips leading www. and lowercases all characters', function() {
      assert.deepEqual(
        normalizeHostname('www.bleep.bloop.com'),
        'bleep.bloop.com'
      );

      assert.deepEqual(normalizeHostname(null), '');

      assert.deepEqual(
        normalizeHostname('bleep.www.bleep.bloop.com'),
        'bleep.www.bleep.bloop.com'
      );

      assert.deepEqual(
        normalizeHostname('www.BLEEP.www.BLEEP.bloop.com'),
        'bleep.www.bleep.bloop.com'
      );
    });
  });

  describe('#attributeQuery', function() {
    it('adds a btn_ref', function() {
      assert.deepEqual(attributeQuery({ a: 1 }, 'srctok-XXX'), {
        a: 1,
        btn_ref: 'srctok-XXX',
      });

      assert.deepEqual(attributeQuery({ btn_ref: 1 }, 'srctok-XXX'), {
        btn_ref: 'srctok-XXX',
      });
    });

    it('adds a non-standard ref', function() {
      assert.deepEqual(attributeQuery({ a: 1 }, 'srctok-XXX', 'pavel'), {
        a: 1,
        pavel: 'srctok-XXX',
        btn_refkey: 'pavel',
      });
    });

    it('doesnt mutate input', function() {
      const query = { a: 1 };

      assert.deepEqual(attributeQuery(query, 'srctok-XXX'), {
        a: 1,
        btn_ref: 'srctok-XXX',
      });
      assert.deepEqual(query, { a: 1 });
    });
  });

  describe('#attributeLink', function() {
    it('attributes a link', function() {
      assert.deepEqual(
        attributeLink('https://pavel.net', 'srctok-XXX'),
        'https://pavel.net?btn_ref=srctok-XXX'
      );

      assert.deepEqual(
        attributeLink('https://pavel.net/1/2?a=1', 'srctok-XXX'),
        'https://pavel.net/1/2?a=1&btn_ref=srctok-XXX'
      );

      assert.deepEqual(
        attributeLink('https://pavel.net/?a=1', 'srctok-XXX'),
        'https://pavel.net?a=1&btn_ref=srctok-XXX'
      );

      assert.deepEqual(
        attributeLink('https://pavel.net/?a=1#anchor', 'srctok-XXX'),
        'https://pavel.net?a=1&btn_ref=srctok-XXX#anchor'
      );

      assert.deepEqual(
        attributeLink('https://pavel.net/?btn_ref=1#anchor', 'srctok-XXX'),
        'https://pavel.net?btn_ref=srctok-XXX#anchor'
      );

      assert.deepEqual(attributeLink(null, 'srctok-XXX'), null);
    });

    it('adds a non-standard ref', function() {
      assert.deepEqual(
        attributeLink('https://pavel.net/?a=1#anchor', 'srctok-XXX', 'pavel'),
        'https://pavel.net?a=1&pavel=srctok-XXX&btn_refkey=pavel#anchor'
      );
    });
  });

  describe('#urlCacheKey', function() {
    it('returns a reasonable default cache key for a url', function() {
      assert.deepEqual(urlCacheKey('http://pup.com'), 'pup.com/');
      assert.deepEqual(urlCacheKey('https://pup.com'), 'pup.com/');
      assert.deepEqual(urlCacheKey('http://pup.com/1/2'), 'pup.com/1/2');
      assert.deepEqual(urlCacheKey('http://pup.com/1/2#anchor'), 'pup.com/1/2');
      assert.deepEqual(
        urlCacheKey('http://pup.com/1/2?q=1#anchor'),
        'pup.com/1/2'
      );
      assert.deepEqual(urlCacheKey('httppup.com'), 'httppup.com');
      assert.deepEqual(urlCacheKey(''), '');
      assert.deepEqual(urlCacheKey(null), null);
    });
  });
});
