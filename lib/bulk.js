/**
 * Returns a Koa middleware capable of serving "bulk" requests.  Write one
 * handler function for an endpoint, and you get bulk requests for free.
 *
 * In less opaque terms, it handles an object request body by forwarding that
 * object onto a handler function, and handles an array request body by invoking
 * the handler once for each entry in the array.
 *
 * Because of how Koa structures message passing between middlewares (ctx),
 * handlers have a slightly different format from classical middleware.  Namely:
 *
 *   * to set the response data, just return a value from your handler (don't
 *     mutate ctx). The value you return can be a promise if your handler needs
 *     to execute anything asynchronous.
 *   * to return an HTTP error, just throw an error with a `status` attribute.
 *
 *
 * ## Usage
 *
 * const user = bulk(async (ctx, body) => {
 *   const { user_id: userId } = body;
 *   const user = await fetchUserById(userId);
 *
 *   return {
 *     name: user.name,
 *     id: user.id,
 *   };
 * });
 *
 * router.post('/user', user);
 *
 * Then, we can send the following payloads:
 *
 * POST /user { id: 123 }
 *   => { name: "Diggy", id: 123 }
 * POST /user [{ id: 123 }, { id: 456 }]
 *   => [{ name: "Diggy", id: 123 }, { name: "Grapes", id: 456 }]
 *
 * @param  {Function(ctx, body)} handler A handler function
 * @return {Function} A koa middleware capable of serving requests.
 */
function bulk(handler) {
  return async ctx => {
    const { body } = ctx.request;

    if (Array.isArray(body)) {
      ctx.body = await Promise.all(body.map(handleBulk(ctx, handler)));
    } else {
      ctx.body = await handler(ctx, body);
    }
  };
}

/**
 * Helper function for collecting warnings over a bulk request.
 *
 * @param  {Koa.Context} ctx
 * @param  {Function} handler
 * @return {Promise}
 */
function handleBulk(ctx, handler) {
  return async (body, i) => {
    let warning = null;

    try {
      return await handler(ctx, body);
    } catch (e) {
      if (e.status && e.status < 500) {
        warning = e;
        return null;
      }

      throw e;
    } finally {
      ctx.state.warnings[i] = warning;
    }
  };
}

module.exports = {
  bulk,
};
