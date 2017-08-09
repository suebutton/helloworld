const assert = require('assert');
const nock = require('nock');

const { mochaAsync } = require('../helpers');

const { promiseRequest } = require('../../lib/request');

describe('lib/request', function() {
  describe('#promiseRequest', function() {
    it(
      'makes a network request and returns a promise',
      mochaAsync(async function() {
        const scope = nock('http://bloop.biz:80', {
          reqheaders: { 'User-Agent': 'ButtonBot/1.0' },
        })
          .post('/bleep')
          .reply(200, { ok: 'computer' });

        const result = await promiseRequest({
          method: 'POST',
          url: 'http://bloop.biz/bleep',
        });

        assert.deepEqual(JSON.parse(result.body), { ok: 'computer' });
        scope.done();
      })
    );

    it(
      'merges request headers',
      mochaAsync(async function() {
        const scope = nock('http://bloop.biz:80', {
          reqheaders: {
            'User-Agent': 'ButtonBot/1.0',
            'X-Bloop-Sequence': '1989',
          },
        })
          .post('/bleep')
          .reply(200, { ok: 'computer' });

        const result = await promiseRequest({
          method: 'POST',
          url: 'http://bloop.biz/bleep',
          headers: { 'X-Bloop-Sequence': 1989, 'User-Agent': 'BloopBot/1.0' },
        });

        assert.deepEqual(JSON.parse(result.body), { ok: 'computer' });
        scope.done();
      })
    );

    it(
      'resolves HTTP 4XX failures',
      mochaAsync(async function() {
        const scope = nock('http://bloop.biz:80')
          .post('/bleep')
          .reply(403, { ok: 'computer' });

        const result = await promiseRequest({
          method: 'POST',
          url: 'http://bloop.biz/bleep',
        });

        assert.deepEqual(JSON.parse(result.body), { ok: 'computer' });
        scope.done();
      })
    );

    it('handles HTTP 5XX failures', function(done) {
      const scope = nock('http://bloop.biz:80')
        .post('/bleep')
        .reply(500, { ok: 'computer' });

      promiseRequest({
        method: 'POST',
        url: 'http://bloop.biz/bleep',
      })
        .then(() => done('Should have rejected'))
        .catch(e => {
          assert(e instanceof Error);
          scope.done();
          done();
        });
    });

    it('handles request failures', function(done) {
      const scope = nock('http://bloop.biz:80')
        .post('/bleep')
        .replyWithError('EBLOOP');

      promiseRequest({
        method: 'POST',
        url: 'http://bloop.biz/bleep',
      })
        .then(() => done('Should have rejected'))
        .catch(e => {
          assert(e instanceof Error);
          assert.deepEqual(e.message, 'EBLOOP');
          scope.done();
          done();
        });
    });

    it('handles timeouts', function(done) {
      const scope = nock('http://bloop.biz:80')
        .post('/bleep')
        .socketDelay(2000)
        .reply(200, 'ok');

      promiseRequest({
        method: 'POST',
        url: 'http://bloop.biz/bleep',
        timeout: 1000,
      })
        .then(() => done('Should have rejected'))
        .catch(e => {
          assert(e instanceof Error);
          assert.deepEqual(e.message, 'ESOCKETTIMEDOUT');
          scope.done();
          done();
        });
    });
  });
});
