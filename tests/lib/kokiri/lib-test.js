const assert = require('assert');

const {
  parseUrl,
  joinPathname,
  cleanPathname,
  formatUrl,
  formatButtonUniversalUrl,
  compact,
  isHostnameMatch,
  isArrayMatch,
  normalizeHostname,
  normalizeUrl,
  attributeLink,
  urlCacheKey,
  orderedQuery,
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
        search: null,
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

  describe('#formatButtonUniversalUrl', function() {
    it('formars a url', function() {
      assert.deepEqual(
        formatButtonUniversalUrl('pup', {
          pathname: '1',
          query: { a: 2 },
          hash: 'pavel',
        }),
        'https://pup.bttn.io/1?a=2#pavel'
      );

      assert.deepEqual(
        formatButtonUniversalUrl('pup', {
          protocol: 'http',
          hostname: 'bloop.bleep',
          pathname: '1',
          query: { a: 2 },
          hash: 'pavel',
        }),
        'https://pup.bttn.io/1?a=2#pavel'
      );

      assert.deepEqual(
        formatButtonUniversalUrl('pup', { pathname: '/' }),
        'https://pup.bttn.io'
      );

      assert.deepEqual(
        formatButtonUniversalUrl('pup', {}),
        'https://pup.bttn.io'
      );
    });

    it('normalizes pathnames', function() {
      assert.deepEqual(
        formatButtonUniversalUrl('pup', {
          pathname: '//1/2///3///',
        }),
        'https://pup.bttn.io/1/2/3'
      );

      assert.deepEqual(
        formatButtonUniversalUrl(
          'pup',
          {
            pathname: '//1/2///3///',
          },
          false
        ),
        'https://pup.bttn.io//1/2///3///'
      );

      assert.deepEqual(
        formatButtonUniversalUrl('pup', {
          pathname: '1/2',
        }),
        'https://pup.bttn.io/1/2'
      );
    });
  });

  describe('#compact', function() {
    it('compacts objects', function() {
      assert.deepEqual(compact(), {});
      assert.deepEqual(compact({ a: 1 }), { a: 1 });
      assert.deepEqual(compact({ a: 1, b: null }), { a: 1 });
      assert.deepEqual(compact({ a: undefined, b: null }), { a: undefined });
    });

    it('compacts objects with special predicates', function() {
      assert.deepEqual(compact({ a: 1, b: 2 }, v => v % 2 === 0), { b: 2 });
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

  describe('#normalizeUrl', function() {
    it('prepends a protocol if not specified', function() {
      assert.deepEqual(normalizeUrl('http://bleep.com'), 'http://bleep.com');

      assert.deepEqual(
        normalizeUrl('http://www.bleep.com'),
        'http://www.bleep.com'
      );

      assert.deepEqual(normalizeUrl('bleep.com'), 'https://bleep.com');
      assert.deepEqual(normalizeUrl('bleep'), 'https://bleep');
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

      assert.deepEqual(
        attributeLink('https://pavel.net/?btn_tkn=1#anchor', 'srctok-XXX'),
        'https://pavel.net?btn_ref=srctok-XXX#anchor'
      );

      assert.deepEqual(attributeLink(null, 'srctok-XXX'), null);
    });

    it('attributes a link using a different key merchants wont be sensitive to', function() {
      assert.deepEqual(
        attributeLink('https://pavel.net', 'srctok-XXX', false),
        'https://pavel.net?btn_tkn=srctok-XXX'
      );

      assert.deepEqual(
        attributeLink('https://pavel.net/1/2?a=1', 'srctok-XXX', false),
        'https://pavel.net/1/2?a=1&btn_tkn=srctok-XXX'
      );

      assert.deepEqual(
        attributeLink(
          'https://pavel.net/?btn_ref=1#anchor',
          'srctok-XXX',
          false
        ),
        'https://pavel.net?btn_tkn=srctok-XXX#anchor'
      );

      assert.deepEqual(
        attributeLink(
          'https://pavel.net/?btn_tkn=1#anchor',
          'srctok-XXX',
          false
        ),
        'https://pavel.net?btn_tkn=srctok-XXX#anchor'
      );
    });

    it('preserves ordering if the link is already attributed', function() {
      assert.deepEqual(
        attributeLink(
          'https://pavel.net?btn_ref=1234&a=2&b=3',
          'srctok-XXX',
          true
        ),
        'https://pavel.net?btn_ref=srctok-XXX&a=2&b=3'
      );

      assert.deepEqual(
        attributeLink(
          'https://pavel.net?a=2&btn_ref=1234&b=3',
          'srctok-XXX',
          true
        ),
        'https://pavel.net?a=2&btn_ref=srctok-XXX&b=3'
      );

      assert.deepEqual(
        attributeLink(
          'https://pavel.net?a=2&b=3&btn_ref=1234',
          'srctok-XXX',
          true
        ),
        'https://pavel.net?a=2&b=3&btn_ref=srctok-XXX'
      );

      assert.deepEqual(
        attributeLink(
          'https://pavel.net?a=2&b=3&btn_tkn=1234&btn_ref=1234',
          'srctok-XXX',
          true
        ),
        'https://pavel.net?a=2&b=3&btn_ref=srctok-XXX'
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

  describe('#orderedQuery', function() {
    it('returns a querystring with parameters in the order that they were passed', function() {
      const query1 = {};
      const query2 = { c: 3 };
      assert.deepEqual(orderedQuery([query1]), '');
      assert.deepEqual(orderedQuery([{ a: 'one' }]), '?a=one');
      assert.deepEqual(orderedQuery([{ a: 1 }, { b: 2 }]), '?a=1&b=2');
      assert.deepEqual(orderedQuery([{ a: 1 }, { b: 2 }, query1]), '?a=1&b=2');
      assert.deepEqual(orderedQuery([query1, { a: 1 }, { b: 2 }]), '?a=1&b=2');
      assert.deepEqual(orderedQuery([{ a: 1 }, query2]), '?a=1&c=3');
      assert.deepEqual(orderedQuery([query2, { a: 1 }]), '?c=3&a=1');
      assert.deepEqual(
        orderedQuery([{ a: 1, b: 2 }, { c: 3 }]),
        '?a=1&b=2&c=3'
      );
      assert.deepEqual(
        orderedQuery([{ obla: 'dee' }, { obla: 'dah' }]),
        '?obla=dee&obla=dah'
      );
      assert.deepEqual(
        orderedQuery([
          { url: 'https://usebutton.com' },
          { username: 'test@usebutton.com' },
          { password: 'pa$$w0rd&st3althy' },
        ]),
        '?url=https%3A%2F%2Fusebutton.com&username=test%40usebutton.com&password=pa%24%24w0rd%26st3althy'
      );
    });
  });
});
