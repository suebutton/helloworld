const assert = require('assert');
const HTTP = require('baseweb/util/http');

const { createValidate, validUrl } = require('../../lib/validate');

describe('lib/validate', function() {
  describe('#createValidate', function() {
    it('creates a basic validation function', function() {
      const validate = createValidate([{ key: 'bloop' }, { key: 'bleep' }]);

      assert(validate({ bloop: 1, bleep: false }));
      assert(validate({ bloop: 1, bleep: false, blop: true }));
      assert(validate({ bloop: null, bleep: false }));
      assert.throws(() => validate({ bloop: 1 }), HTTP.BadRequestError);
      assert.throws(() => validate({}), HTTP.BadRequestError);
    });

    it('allows custom predicates', function() {
      const isEven = x => x % 2 === 0;

      const validate = createValidate([
        { key: 'bloop', predicate: isEven },
        { key: 'bleep', predicate: x => !isEven(x) },
      ]);

      assert(validate({ bloop: 2, bleep: 1 }));
      assert.throws(
        () => validate({ bloop: 1, bleep: 1 }),
        HTTP.BadRequestError
      );
    });

    it('allows custom errors', function() {
      const getError = x => new Error(`Bad param: ${x}`);
      const validate = createValidate([{ key: 'bloop', getError }]);

      assert.throws(() => validate({}), e => e.message === 'Bad param: bloop');
    });
  });

  describe('#validUrl', function() {
    it('returns true for a valid url', function() {
      assert(validUrl('http://bloop.biz'));
      assert(validUrl('https://bloop.biz'));
      assert(validUrl('https://bloop.biz/1'));
      assert(validUrl('https://bloop.biz/1?q=2'));
      assert(validUrl('https://bloop.biz/1?q=2#a'));
      assert(validUrl('ftp://bloop.biz/1?q=2#a'));
      assert(!validUrl(undefined));
      assert(!validUrl(null));
      assert(!validUrl(false));
      assert(!validUrl(true));
      assert(!validUrl([]));
      assert(!validUrl(''));
      assert(!validUrl('bloop'));
      assert(!validUrl('bloop.com'));
      assert(!validUrl('http:bloop.com'));
      assert(!validUrl('http:/bloop.com'));
    });
  });
});
