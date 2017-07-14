const { viewSuccess } = require('../lib/view');

/**
 * A middleware which handles formatting successful responses.
 *
 * @param  {Koa.Context} ctx
 * @param  {Function} next
 */
module.exports = async function format(ctx, next) {
  ctx.state.warnings = [];
  await next();
  ctx.body = viewSuccess(ctx.body, ctx.state.warnings);
};
