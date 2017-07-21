const assert = require('assert');
const Koa = require('koa');
const router = require('koa-router');
const supertest = require('supertest-koa-agent');

const requestId = require('../../middleware/request-id');

describe('middlware/request-id', function() {
  beforeEach(function() {
    const routes = router().get('/bloop', ctx => {
      ctx.body = { requestId: ctx.state.requestId };
    });

    const app = new Koa();
    app.use(requestId);
    app.use(routes.routes());

    this.request = supertest(app);
  });

  it('grabs the incoming request id', function(done) {
    this.request
      .get('/bloop')
      .set('X-Button-Request', 'reqid-bloop')
      .expect(200)
      .expect(res => {
        assert.deepEqual(res.body, { requestId: 'reqid-bloop' });
      })
      .end(done);
  });
});
