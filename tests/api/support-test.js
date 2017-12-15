const assert = require('assert');
const supertest = require('supertest-koa-agent');
const sinon = require('sinon');

const { app } = require('../helpers');

describe('api /v1/config', function() {
  beforeEach(function() {
    this.kokiriAdapter = {
      exampleLinks: sinon.spy(() => {
        return [
          {
            url: 'https://www.hotels.com',
            label: 'Hotels link',
            bucket: 'Homepage',
          },
          {
            url: 'https://ebay.com',
            label: 'Ebay link',
            bucket: 'Homepage',
          },
        ];
      }),
      appLinkingSupport: sinon.spy(() => {
        return {
          webToApp: true,
          appToApp: true,
        };
      }),
    };
    this.app = app({ kokiriAdapter: this.kokiriAdapter });
    this.request = supertest(this.app.koa);
  });

  describe('POST /v1/support/app-links', function() {
    it('returns an app linking support report', function(done) {
      this.request
        .post('/v1/support/app-links')
        .send({ merchant_id: 'org-XXX' })
        .expect(200)
        .expect(res => {
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              objects: [
                {
                  url: 'https://www.hotels.com',
                  label: 'Hotels link',
                  bucket: 'Homepage',
                  ios_support: {
                    web_to_app: true,
                    app_to_app: true,
                  },
                  android_support: {
                    web_to_app: true,
                    app_to_app: true,
                  },
                },
                {
                  url: 'https://ebay.com',
                  label: 'Ebay link',
                  bucket: 'Homepage',
                  ios_support: {
                    web_to_app: true,
                    app_to_app: true,
                  },
                  android_support: {
                    web_to_app: true,
                    app_to_app: true,
                  },
                },
              ],
              warnings: [],
            },
          });
        })
        .expect(() => {
          assert.equal(this.kokiriAdapter.exampleLinks.callCount, 1);
          assert.equal(this.kokiriAdapter.appLinkingSupport.callCount, 4);
        })
        .end(done);
    });

    it('requires a merchant_id', function(done) {
      this.request
        .post('/v1/support/app-links')
        .send({ bloop: 'org-XXX' })
        .expect(400)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'error',
            },
            error: {
              message: 'Missing required argument: merchant_id',
              type: 'MissingArgument',
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.appLinkingSupport.callCount, 0);
        })
        .end(done);
    });
  });
});
