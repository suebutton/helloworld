const { noop } = require('lodash');

/**
 * A wrapper around node-redis.
 */
class RedisClient {
  /**
   * @param  {NodeRedis.Client} A node-redis client instance
   * @param  {libbtn.Metrics} metrics
   * @return {RedisClient}
   */
  constructor(client, metrics) {
    this.client = client;
    this.metrics = metrics;

    // If our connection to redis goes down, node-redis will throw an exception
    // that won't be caught if an error handler isn't provided.
    this.client.on('error', noop);
  }

  /**
   * @private
   * @param  {string} namespace
   * @param  {string} event
   */
  incrementEvent(namespace, event) {
    this.metrics.increment({
      name: 'kokiri_redis_event',
      namespace,
      event,
      statsdName: `kokiri.redis.${namespace}.${event}`,
    });
  }

  /**
   * @private
   * @param  {Date} start
   * @param  {string} event
   */
  timing(event, start) {
    this.metrics.timing(
      {
        name: 'kokiri_redis_timing',
        event,
      },
      start
    );
  }

  /**
   * Invokes a node-style method on the redis client and returns a Promise.
   *
   * @param  {string} method The redis method (like 'get' or 'set')
   * @param  {...*} args Any arguments to forward to the method call
   * @return {Promise}
   */
  invoke(method, ...args) {
    return new Promise((resolve, reject) => {
      this.client[method](
        ...args.concat((err, res) => {
          err ? reject(err) : resolve(res);
        })
      );
    });
  }

  /**
   * Batches many commands together an exectures in a single request to redis.
   * Commands will not be executed in a transaction.
   *
   * Commands are passed as an array where each element is an array of arguments
   * with the 0th element being the command to invoke and subsequent elements
   * being the arguments to that command.
   *
   * For instance:
   *
   *   invokeBatch([['get', key], ['set', key, value]]).then(...)
   *
   * @param  {Array.<Array>} commands
   * @return {Promise}
   */
  invokeBatch(commands) {
    return new Promise((resolve, reject) => {
      this.client.batch(commands).exec((err, res) => {
        err ? reject(err) : resolve(res);
      });
    });
  }

  /**
   * Generate a redis key by composing a namespace for the key and the actual
   * identifier
   *
   * @param  {string} namespace
   * @param  {string} key
   * @return {string}
   */
  key(namespace, key) {
    return `${namespace}:${key}`;
  }

  /**
   * @param  {...*} args Any arguments to forward to the method call
   * @return {Promise}
   */
  get(...args) {
    return this.invoke('get', ...args);
  }

  /**
   * @param  {...*} args Any arguments to forward to the method call
   * @return {Promise}
   */
  set(...args) {
    return this.invoke('set', ...args);
  }

  /**
   * Returns a Promise that resolves to a tuple of [value, dbsize].  Handy for
   * logging the current size of the cache without incurring an extra round
   * trip.
   *
   * @param  {string} key
   * @return {Array}
   */
  getValueAndDBSize(key) {
    return this.invokeBatch([['get', key], ['dbsize']]);
  }

  /**
   * Check if a key exists in the cache.  If so, return the value.  If not,
   * invoke `work`, a promise-returning function, set the resolved value in the
   * cache, and return it.
   *
   * @param  {string} namespace A namespace
   * @param  {string} key
   * @param  {Function} work A 0-Arity function which returns a promise
   *   resolving to the value to persist in the cache.
   * @param  {Function} ttl Function to retrieve the time-to-live of the value
   *   in redis, in seconds.  Passed the value resolved by work.
   * @return {Promise}
   */
  async getSet(namespace, key, work, ttl = () => -1) {
    const start = new Date();

    if (!this.client.connected) {
      this.incrementEvent(namespace, 'no-connection');
      return work();
    }

    const fullKey = this.key(namespace, key);
    const [cachedValue, count] = await this.getValueAndDBSize(fullKey);

    this.metrics.gauge(
      { name: 'kokiri_redis_dbsize', statsdName: 'kokiri.redis.dbsize' },
      count
    );

    if (cachedValue) {
      this.incrementEvent(namespace, 'hit');
      this.timing('get-set-hit', start);
      return cachedValue;
    }

    const value = await work();

    this.incrementEvent(namespace, 'miss');
    this.timing('get-set-miss', start);

    // Resolve the returned promise independent of our set operation, we don't
    // actually need to wait for this to succeed to continue.
    this.set(fullKey, value, 'EX', ttl(value));

    return value;
  }
}

module.exports = RedisClient;
