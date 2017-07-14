const redis = require('redis');

/**
 * A wrapper around node-redis.
 */
class RedisClient {
  /**
   * @param  {...*} args Proxied args to node-redis
   * @return {RedisClient}
   */
  constructor(...args) {
    this.client = redis.createClient(...args);
  }

  /**
   * Invokes a node-style method on the redis client and returns a Promise.
   *
   * @param  {string} method The redis method (like 'get' or 'set')
   * @param  {...*} args Any arguments to forward to the method call
   * @return {Promise}
   */
  promisify(method, args) {
    return new Promise((resolve, reject) => {
      this.client[method](
        ...args.concat((err, res) => {
          err ? reject(err) : resolve(res);
        })
      );
    });
  }

  /**
   * @param  {...*} args Any arguments to forward to the method call
   * @return {Promise}
   */
  get(...args) {
    return this.promisify('get', args);
  }

  /**
   * @param  {...*} args Any arguments to forward to the method call
   * @return {Promise}
   */
  set(...args) {
    return this.promisify('set', args);
  }

  /**
   * Check if a key exists in the cache.  If so, return the value.  If not,
   * invoke `work`, a promise-returning function, set the resolved value in the
   * cache, and return it.
   *
   * @param  {string} key
   * @param  {Function} work A 0-Arity function which returns a promise
   *   resolving to the value to persist in the cache.
   * @param  {ttl} ttl The time-to-live of the value in redis, in seconds.
   * @return {Promise}
   */
  async getSet(key, work, ttl = -1) {
    const cachedValue = await this.get(key);

    if (cachedValue) {
      return cachedValue;
    }

    const value = await work();
    await this.set(key, value, 'EX', ttl);

    return value;
  }

  /**
   * @param  {...*} args Any arguments to forward to the method call
   */
  on(...args) {
    return this.client.on(...args);
  }
}

module.exports = RedisClient;
