const assert = require('assert');
const sinon = require('sinon');

const { mochaAsync } = require('../helpers');

const RedisClient = require('../../lib/redis');

describe('lib/redis', function() {
  beforeEach(function() {
    this.batch = {
      exec: sinon.spy(callback =>
        setTimeout(() => callback(null, [null, 1989]), 0)
      ),
    };
    this.nodeRedis = {
      connected: true,
      get: sinon.spy((a, callback) => {
        setTimeout(() => callback(null, 'ok'), 0);
      }),
      set: sinon.spy((a, b, c, d, callback) => {
        setTimeout(() => callback(null, 'ok'), 0);
      }),
      on: sinon.spy(() => 'ok'),
      batch: sinon.spy(() => this.batch),
    };
    this.metrics = {
      increment: sinon.spy(),
      gauge: sinon.spy(),
      timing: sinon.spy(),
    };
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

  describe('#invoke', function() {
    it(
      'invokes a node-style method and returns a promise',
      mochaAsync(async function() {
        const result = await this.redisClient.invoke('get', 1);
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
        .invoke('bloop', 1)
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

  describe('#invokeBatch', function() {
    it(
      'invokes a node-style method and returns a promise',
      mochaAsync(async function() {
        const [get, size] = await this.redisClient.invokeBatch([
          ['get', 'bloop'],
          ['dbsize'],
        ]);
        assert.deepEqual(get, null);
        assert.deepEqual(size, 1989);
        assert.equal(this.batch.exec.callCount, 1);
        assert.equal(this.nodeRedis.batch.callCount, 1);
        assert.deepEqual(this.nodeRedis.batch.args[0][0], [
          ['get', 'bloop'],
          ['dbsize'],
        ]);
      })
    );

    it('handles errors', function(done) {
      this.batch.exec = sinon.spy(callback =>
        setTimeout(() => callback(new Error('bork'), null), 0)
      );

      this.redisClient
        .invokeBatch([['get', 'bloop']])
        .then(() => done('Should have rejected'))
        .catch(e => {
          assert(e instanceof Error);
          assert.equal(this.batch.exec.callCount, 1);
          assert.equal(this.nodeRedis.batch.callCount, 1);
          assert.deepEqual(this.nodeRedis.batch.args[0][0], [['get', 'bloop']]);
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
        this.nodeRedis.set = sinon.spy((a, callback) => {
          setTimeout(() => callback(null, 'ok'), 0);
        });

        const result = await this.redisClient.set(1);
        assert.deepEqual(result, 'ok');
        assert.equal(this.nodeRedis.set.callCount, 1);
        assert.equal(this.nodeRedis.set.args[0][0], 1);
        assert.equal(typeof this.nodeRedis.set.args[0][1], 'function');
      })
    );
  });

  describe('#getValueAndDBSize', function() {
    it(
      'invokes a node-style method and returns a promise',
      mochaAsync(async function() {
        const [get, size] = await this.redisClient.getValueAndDBSize('bloop');
        assert.deepEqual(get, null);
        assert.deepEqual(size, 1989);
        assert.equal(this.batch.exec.callCount, 1);
        assert.equal(this.nodeRedis.batch.callCount, 1);
        assert.deepEqual(this.nodeRedis.batch.args[0][0], [
          ['get', 'bloop'],
          ['dbsize'],
        ]);
      })
    );
  });

  describe('#getSet', function() {
    it(
      'returns a cached value',
      mochaAsync(async function() {
        this.batch.exec = sinon.spy(callback =>
          setTimeout(() => callback(null, ['ok', 1989]), 0)
        );

        const work = sinon.spy();
        const result = await this.redisClient.getSet('bloop', 'bleep', work);

        assert.deepEqual(result, 'ok');
        assert.equal(work.callCount, 0);
        assert.equal(this.nodeRedis.batch.callCount, 1);
        assert.deepEqual(this.nodeRedis.batch.args[0][0], [
          ['get', 'bloop:bleep'],
          ['dbsize'],
        ]);

        assert.equal(this.metrics.increment.callCount, 1);
        assert.deepEqual(this.metrics.increment.args[0][0], {
          name: 'kokiri_redis_event',
          namespace: 'bloop',
          event: 'hit',
        });

        assert.equal(this.metrics.gauge.callCount, 1);
        assert.deepEqual(this.metrics.gauge.args[0], [
          { name: 'kokiri_redis_dbsize' },
          1989,
        ]);

        assert.equal(this.metrics.timing.callCount, 1);
        assert.deepEqual(this.metrics.timing.args[0][0], {
          name: 'kokiri_redis_timing',
          event: 'get-set-hit',
        });
      })
    );

    it(
      'returns a non-cached value',
      mochaAsync(async function() {
        this.nodeRedis.set = sinon.spy((a, b, c, d, callback) => {
          setTimeout(() => callback(null, 'ok'), 0);
        });

        const work = sinon.spy(() => Promise.resolve('fetched-ok'));
        const result = await this.redisClient.getSet('bloop', 'bleep', work);

        assert.deepEqual(result, 'fetched-ok');
        assert.equal(work.callCount, 1);
        assert.equal(this.nodeRedis.batch.callCount, 1);
        assert.deepEqual(this.nodeRedis.batch.args[0][0], [
          ['get', 'bloop:bleep'],
          ['dbsize'],
        ]);
        assert.equal(this.nodeRedis.set.callCount, 1);
        assert.deepEqual(this.nodeRedis.set.args[0][0], 'bloop:bleep');
        assert.deepEqual(this.nodeRedis.set.args[0][1], 'fetched-ok');
        assert.deepEqual(this.nodeRedis.set.args[0][2], 'EX');
        assert.deepEqual(this.nodeRedis.set.args[0][3], -1);

        assert.equal(this.metrics.increment.callCount, 1);
        assert.deepEqual(this.metrics.increment.args[0][0], {
          name: 'kokiri_redis_event',
          namespace: 'bloop',
          event: 'miss',
        });

        assert.equal(this.metrics.gauge.callCount, 1);
        assert.deepEqual(this.metrics.gauge.args[0], [
          { name: 'kokiri_redis_dbsize' },
          1989,
        ]);

        assert.equal(this.metrics.timing.callCount, 1);
        assert.deepEqual(this.metrics.timing.args[0][0], {
          name: 'kokiri_redis_timing',
          event: 'get-set-miss',
        });
      })
    );

    it(
      'allows for dynamic ttls',
      mochaAsync(async function() {
        const ttl = sinon.spy(() => 1989);
        const work = sinon.spy(() => Promise.resolve('fetched-ok'));
        const result = await this.redisClient.getSet(
          'bloop',
          'bleep',
          work,
          ttl
        );

        assert.deepEqual(result, 'fetched-ok');
        assert.equal(this.nodeRedis.set.callCount, 1);
        assert.deepEqual(this.nodeRedis.set.args[0][3], 1989);
        assert.deepEqual(ttl.callCount, 1);
        assert.deepEqual(ttl.args[0], ['fetched-ok']);
      })
    );

    it(
      'invokes work directly with no redis connection',
      mochaAsync(async function() {
        this.nodeRedis.connected = false;
        const work = sinon.spy(() => Promise.resolve('ok-no-cache'));
        const result = await this.redisClient.getSet('bloop', 'bleep', work);
        assert.deepEqual(result, 'ok-no-cache');
        assert.equal(work.callCount, 1);
        assert.equal(this.nodeRedis.get.callCount, 0);
        assert.equal(this.nodeRedis.set.callCount, 0);
        assert.equal(this.metrics.increment.callCount, 1);
        assert.deepEqual(this.metrics.increment.args[0][0], {
          name: 'kokiri_redis_event',
          namespace: 'bloop',
          event: 'no-connection',
        });
      })
    );
  });
});
