/**
 * A middleware which handles reading an inbound request it and setting it on
 * the Koa state for convenience.
 *
 * @param  {Koa.Context} ctx
 * @param  {Function} next
 */
module.exports = async function requestId(ctx, next) {
  const requestId = ctx.request.header['x-button-request'];
  ctx.state.requestId = requestId || null;
  await next();
};
