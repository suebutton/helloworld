const assert = require('assert');
const sinon = require('sinon');
const nock = require('nock');

const { mochaAsync } = require('../helpers');

const { redirect, FAILURE, cleanUrl } = require('../../lib/redirect');

describe('lib/redirect', function() {
  describe('#redirect', function() {
    beforeEach(function() {
      this.redis = {
        getSet: sinon.spy((namespace, key, work) => work()),
      };
    });

    it(
      'caches redirects',
      mochaAsync(async function() {
        const initialCall = nock('http://bloop.com')
          .get('/')
          .reply(302, undefined, { Location: 'http://bleep.biz/tada' });

        const redirectCall = nock('http://bleep.biz').get('/tada').reply(200);

        const result = await redirect(
          this.redis,
          'bloop.com',
          'http://bloop.com'
        );

        assert.deepEqual(result, 'http://bleep.biz/tada');

        assert.equal(this.redis.getSet.callCount, 1);
        assert.deepEqual(this.redis.getSet.args[0][0], 'urlredirect');
        assert.deepEqual(this.redis.getSet.args[0][1], 'bloop.com');
        assert.deepEqual(this.redis.getSet.args[0][3](), 345600);

        const workResult = await this.redis.getSet.returnValues[0];
        assert.deepEqual(workResult, 'http://bleep.biz/tada');

        initialCall.done();
        redirectCall.done();
      })
    );

    it(
      'caches redirects which end in a non 2XX status code',
      mochaAsync(async function() {
        const initialCall = nock('http://bloop.com')
          .get('/')
          .reply(302, undefined, { Location: 'http://bleep.biz/tada' });

        const redirectCall = nock('http://bleep.biz').get('/tada').reply(403);

        const result = await redirect(
          this.redis,
          'bloop.com',
          'http://bloop.com'
        );

        assert.deepEqual(result, 'http://bleep.biz/tada');

        assert.equal(this.redis.getSet.callCount, 1);
        assert.deepEqual(this.redis.getSet.args[0][0], 'urlredirect');
        assert.deepEqual(this.redis.getSet.args[0][1], 'bloop.com');
        assert.deepEqual(this.redis.getSet.args[0][3](), 345600);

        const workResult = await this.redis.getSet.returnValues[0];
        assert.deepEqual(workResult, 'http://bleep.biz/tada');

        initialCall.done();
        redirectCall.done();
      })
    );

    it(
      'cleans urls',
      mochaAsync(async function() {
        const initialCall = nock('http://bloop.com').get('/').reply(200);

        await redirect(this.redis, 'bloop.com', 'http://bloop.com:0');

        initialCall.done();
      })
    );

    it(
      'caches failures',
      mochaAsync(async function() {
        const initialCall = nock('http://bloop.com')
          .get('/')
          .replyWithError('bang');

        const result = await redirect(
          this.redis,
          'bloop.com',
          'http://bloop.com'
        );

        assert.deepEqual(result, null);

        assert.equal(this.redis.getSet.callCount, 1);
        assert.deepEqual(this.redis.getSet.args[0][0], 'urlredirect');
        assert.deepEqual(this.redis.getSet.args[0][1], 'bloop.com');
        assert.deepEqual(this.redis.getSet.args[0][3](), 345600);

        const workResult = await this.redis.getSet.returnValues[0];
        assert.deepEqual(workResult, FAILURE);

        initialCall.done();
      })
    );
  });

  describe('#cleanUrl', function() {
    it('strips urls with port 0', function() {
      assert.deepEqual(
        cleanUrl('http://bloop.com/1/2?a=2#bleep'),
        'http://bloop.com/1/2?a=2#bleep'
      );
      assert.deepEqual(
        cleanUrl('https://bloop.com/1/2?a=2#bleep'),
        'https://bloop.com/1/2?a=2#bleep'
      );
      assert.deepEqual(
        cleanUrl('ftp://bloop.com/1/2?a=2#bleep'),
        'ftp://bloop.com/1/2?a=2#bleep'
      );
      assert.deepEqual(
        cleanUrl('http://bloop.com:0/1/2?a=2#bleep'),
        'http://bloop.com/1/2?a=2#bleep'
      );
      assert.deepEqual(
        cleanUrl('https://bloop.com:0/1/2?a=2#bleep'),
        'https://bloop.com/1/2?a=2#bleep'
      );
    });
  });
});
