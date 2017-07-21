const assert = require('assert');
const sinon = require('sinon');

const { mochaAsync } = require('../helpers');

const RedisClient = require('../../lib/redis');

describe('lib/redis', function() {
  beforeEach(function() {
    this.nodeRedis = {
      get: sinon.spy((a, callback) => {
        setTimeout(() => callback(null, 'ok'), 0);
      }),
      set: sinon.spy((a, callback) => {
        setTimeout(() => callback(null, 'ok'), 0);
      }),
      on: sinon.spy(() => 'ok'),
    };
    this.metrics = { increment: sinon.spy() };
    this.redisClient = new RedisClient(this.nodeRedis, this.metrics);
  });

  describe('#key', function() {
    it('returns a namespaced cache key', function() {
      assert.deepEqual(
        this.redisClient.key('urlredirect', 'bloop.com'),
        'urlredirect:bloop.com'
      );
    });
  });

  describe('#promisify', function() {
    it(
      'invokes a node-style method and returns a promise',
      mochaAsync(async function() {
        const result = await this.redisClient.promisify('get', 1);
        assert.deepEqual(result, 'ok');
        assert.equal(this.nodeRedis.get.callCount, 1);
        assert.equal(this.nodeRedis.get.args[0][0], 1);
        assert.equal(typeof this.nodeRedis.get.args[0][1], 'function');
      })
    );

    it('handles errors', function(done) {
      this.nodeRedis.bloop = sinon.spy((a, callback) => {
        setTimeout(() => callback(new Error('bleep'), null), 0);
      });

      this.redisClient
        .promisify('bloop', 1)
        .then(() => done('Should have rejected'))
        .catch(e => {
          assert(e instanceof Error);
          assert.equal(this.nodeRedis.bloop.callCount, 1);
          assert.equal(this.nodeRedis.bloop.args[0][0], 1);
          assert.equal(typeof this.nodeRedis.bloop.args[0][1], 'function');
          done();
        });
    });
  });

  describe('#get', function() {
    it(
      'invokes get and returns a promise',
      mochaAsync(async function() {
        const result = await this.redisClient.get(1);
        assert.deepEqual(result, 'ok');
        assert.equal(this.nodeRedis.get.callCount, 1);
        assert.equal(this.nodeRedis.get.args[0][0], 1);
        assert.equal(typeof this.nodeRedis.get.args[0][1], 'function');
      })
    );
  });

  describe('#set', function() {
    it(
      'invokes set and returns a promise',
      mochaAsync(async function() {
        const result = await this.redisClient.set(1);
        assert.deepEqual(result, 'ok');
        assert.equal(this.nodeRedis.set.callCount, 1);
        assert.equal(this.nodeRedis.set.args[0][0], 1);
        assert.equal(typeof this.nodeRedis.set.args[0][1], 'function');
      })
    );
  });

  describe('#getSet', function() {
    it(
      'returns a cached value',
      mochaAsync(async function() {
        const work = sinon.spy();
        const result = await this.redisClient.getSet('bloop', 'bleep', work);
        assert.deepEqual(result, 'ok');
        assert.equal(work.callCount, 0);
        assert.equal(this.nodeRedis.get.callCount, 1);
        assert.equal(this.nodeRedis.get.args[0][0], 'bloop:bleep');
        assert.equal(this.metrics.increment.callCount, 1);
        assert.deepEqual(
          this.metrics.increment.args[0][0],
          'kokiri.redis.bloop.hit'
        );
      })
    );

    it(
      'returns a non-cached value',
      mochaAsync(async function() {
        this.nodeRedis.get = sinon.spy((a, callback) => {
          setTimeout(() => callback(null, null), 0);
        });

        this.nodeRedis.set = sinon.spy((a, b, c, d, callback) => {
          setTimeout(() => callback(null, 'ok'), 0);
        });

        const work = sinon.spy(() => Promise.resolve('fetched-ok'));
        const result = await this.redisClient.getSet('bloop', 'bleep', work);

        assert.deepEqual(result, 'fetched-ok');
        assert.equal(work.callCount, 1);
        assert.equal(this.nodeRedis.get.callCount, 1);
        assert.equal(this.nodeRedis.get.args[0][0], 'bloop:bleep');
        assert.equal(this.nodeRedis.set.callCount, 1);
        assert.deepEqual(this.nodeRedis.set.args[0][0], 'bloop:bleep');
        assert.deepEqual(this.nodeRedis.set.args[0][1], 'fetched-ok');
        assert.deepEqual(this.nodeRedis.set.args[0][2], 'EX');
        assert.deepEqual(this.nodeRedis.set.args[0][3], -1);
        assert.equal(this.metrics.increment.callCount, 1);
        assert.deepEqual(
          this.metrics.increment.args[0][0],
          'kokiri.redis.bloop.miss'
        );
      })
    );
  });

  describe('#on', function() {
    it(
      'proxies calls',
      mochaAsync(async function() {
        const result = this.redisClient.on(1, 2, 3);
        assert.deepEqual(result, 'ok');
        assert.equal(this.nodeRedis.on.callCount, 1);
        assert.deepEqual(this.nodeRedis.on.args[0], [1, 2, 3]);
      })
    );
  });
});
