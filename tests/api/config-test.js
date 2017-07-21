const assert = require('assert');
const supertest = require('supertest-koa-agent');
const sinon = require('sinon');

const { app } = require('../helpers');

describe('api /v1/config', function() {
  beforeEach(function() {
    this.kokiriAdapter = { sdkConfig: sinon.spy(() => ({ config: true })) };
    this.app = app({ kokiriAdapter: this.kokiriAdapter });
    this.request = supertest(this.app.koa);
  });

  describe('GET /v1/config/sdk', function() {
    it('returns a config', function(done) {
      this.request
        .post('/v1/config/sdk')
        .send({ publisher_id: 'org-XXX' })
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              object: {
                config: true,
              },
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.sdkConfig.callCount, 1);
          assert.deepEqual(this.kokiriAdapter.sdkConfig.args[0][0], 'org-XXX');
        })
        .end(done);
    });

    it('requires a publisher_id', function(done) {
      this.request
        .post('/v1/config/sdk')
        .send({ bloop: 'org-XXX' })
        .expect(400)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'error',
            },
            error: {
              message: 'Missing required argument: publisher_id',
              type: 'MissingArgument',
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.sdkConfig.callCount, 0);
        })
        .end(done);
    });
  });
});
