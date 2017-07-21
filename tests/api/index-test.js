const supertest = require('supertest-koa-agent');

const { app } = require('../helpers');

describe('api/index', function() {
  before(function() {
    this.app = app();
    this.request = supertest(this.app.koa);
  });

  it('GET /', function(done) {
    this.request.get('/').expect(200).end(done);
  });

  it('GET /health', function(done) {
    this.request.get('/health').expect(200, 'OK').end(done);
  });

  it('GET /ping', function(done) {
    this.request.get('/health').expect(200, 'OK').end(done);
  });
});
