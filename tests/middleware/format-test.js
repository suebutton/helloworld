const assert = require('assert');
const Koa = require('koa');
const router = require('koa-router');
const supertest = require('supertest-koa-agent');

const format = require('../../middleware/format');

describe('middlware/format', function() {
  beforeEach(function() {
    const routes = router()
      .get('/bloop', ctx => {
        ctx.body = { ok: 'computer' };
      })
      .get('/bork', ctx => {
        ctx.body = [{ bork: 'computer' }];
        ctx.state.warnings.push(new Error('Borked'));
      });

    const app = new Koa();
    app.use(format);
    app.use(routes.routes());

    this.request = supertest(app);
  });

  it('formats outgoing response bodies', function(done) {
    this.request
      .get('/bloop')
      .expect(200)
      .expect(res => {
        assert.deepEqual(res.body, {
          meta: {
            status: 'ok',
          },
          data: {
            object: {
              ok: 'computer',
            },
          },
        });
      })
      .end(done);
  });

  it('collects warnings', function(done) {
    this.request
      .get('/bork')
      .expect(200)
      .expect(res => {
        assert.deepEqual(res.body, {
          meta: {
            status: 'ok',
          },
          data: {
            objects: [
              {
                bork: 'computer',
              },
            ],
            warnings: [
              {
                message: 'Borked',
              },
            ],
          },
        });
      })
      .end(done);
  });
});
