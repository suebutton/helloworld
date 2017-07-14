const supertest = require('supertest-koa-agent');
const App = require('../../app');

describe('api', function() {
  before('create the app', function() {
    this.app = App({});
    this.request = supertest(this.app.koa);
  });

  it('GET /', function() {
    this.request.get('/').expect(200);
  });

  it('GET /health', function() {
    this.request.get('/health').expect(200, 'OK');
  });

  it('GET /ping', function() {
    this.request.get('/health').expect(200, 'OK');
  });
});
