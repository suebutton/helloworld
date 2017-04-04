const supertest = require('supertest-koa-agent');
const App = require('../lib/app');

describe('API', function () {
  let app;
  let request;

  before('create the app', function () {
    app = App({
      logToConsole: false,
      errorLogger: {
        logError(e) {
          this.errorLogged = true;
          console.error(`${e.message}: ${e.stack}`);  // eslint-disable-line no-console
        },
        installGlobalHandler() {},
      },
    });
    request = supertest(app.koa);
  });

  it('GET /hello', function () {
    return request.get('/hello')
        .expect(200, 'Hello world.');
  });

  it('GET /health', function () {
    request.get('/health')
        .expect(200, 'OK');
  });
});
