const assert = require('assert');
const supertest = require('supertest-koa-agent');
const sinon = require('sinon');

const { app } = require('../helpers');

describe('api /v1/link', function() {
  beforeEach(function() {
    this.kokiriAdapter = {
      maybeRedirect: sinon.spy((r, url) => {
        if (url === 'http://bloop.com') {
          return Promise.resolve({
            targetUrl: 'http://bleep.biz',
            shouldRedirect: true,
            affiliate: { display_name: 'Bleep!', hostname: 'bleep.biz' },
          });
        }

        return Promise.resolve({
          targetUrl: 'http://pup.biz',
          shouldRedirect: false,
          affiliate: null,
        });
      }),
      linkAttributes: sinon.spy(() => ({
        merchantId: 'org-YYY',
        approved: true,
        hasIosDeeplink: false,
        hasAndroidDeeplink: true,
      })),
      appAction: sinon.spy(() => ({
        app_link: 'bloop:///?btn_ref=srctok-XXX',
        browser_link: 'https://bloop.com?btn_ref=srctok-XXX',
      })),
      universalLink: sinon.spy(() => 'http://track.bttn.io/bloop'),
    };
    this.app = app({ kokiriAdapter: this.kokiriAdapter });
    this.request = supertest(this.app.koa);
  });

  describe('GET /v1/link/attributes', function() {
    it('returns link attributes', function(done) {
      this.request
        .post('/v1/link/attributes')
        .send({ url: 'http://bloop.com', publisher_id: 'org-XXX' })
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              object: {
                affiliate: {
                  display_name: 'Bleep!',
                  hostname: 'bleep.biz',
                },
                approved: true,
                has_android_deeplink: true,
                has_ios_deeplink: false,
                merchant_id: 'org-YYY',
                redirect: true,
              },
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 1);
          assert.deepEqual(
            this.kokiriAdapter.maybeRedirect.args[0][1],
            'http://bloop.com'
          );
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 1);
          assert.deepEqual(this.kokiriAdapter.linkAttributes.args[0], [
            'http://bleep.biz',
            'org-XXX',
          ]);
        })
        .end(done);
    });

    it('returns link attributes with errors', function(done) {
      this.request
        .post('/v1/link/attributes')
        .send({ url: 'http://bloop.com' })
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
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 0);
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 0);
        })
        .end(done);
    });

    it('handles redirect failures', function(done) {
      this.kokiriAdapter.maybeRedirect = async () =>
        Promise.resolve({ targetUrl: null });

      this.request
        .post('/v1/link/attributes')
        .send({ url: 'http://bloop.com', publisher_id: 'org-XXX' })
        .expect(400)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'error',
            },
            error: {
              message: 'Failed to follow redirects for http://bloop.com',
              type: 'RedirectFailed',
            },
          })
        )
        .end(done);
    });

    it('returns bulk link attributes', function(done) {
      this.request
        .post('/v1/link/attributes')
        .send([
          { url: 'http://bloop.com', publisher_id: 'org-XXX' },
          { url: 'http://pup.com', publisher_id: 'org-ZZZ' },
        ])
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              objects: [
                {
                  affiliate: {
                    display_name: 'Bleep!',
                    hostname: 'bleep.biz',
                  },
                  approved: true,
                  has_android_deeplink: true,
                  has_ios_deeplink: false,
                  merchant_id: 'org-YYY',
                  redirect: true,
                },
                {
                  affiliate: null,
                  approved: true,
                  has_android_deeplink: true,
                  has_ios_deeplink: false,
                  merchant_id: 'org-YYY',
                  redirect: false,
                },
              ],
              warnings: [null, null],
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 2);
          assert.deepEqual(
            this.kokiriAdapter.maybeRedirect.args[0][1],
            'http://bloop.com'
          );
          assert.deepEqual(
            this.kokiriAdapter.maybeRedirect.args[1][1],
            'http://pup.com'
          );
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 2);
          assert.deepEqual(this.kokiriAdapter.linkAttributes.args[0], [
            'http://bleep.biz',
            'org-XXX',
          ]);
          assert.deepEqual(this.kokiriAdapter.linkAttributes.args[1], [
            'http://pup.biz',
            'org-ZZZ',
          ]);
        })
        .end(done);
    });

    it('returns bulk link attributes with errors', function(done) {
      this.request
        .post('/v1/link/attributes')
        .send([
          { url: 'http://bloop.com', publisher_id: 'org-XXX' },
          { url: 'http://pup.com' },
        ])
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              objects: [
                {
                  affiliate: {
                    display_name: 'Bleep!',
                    hostname: 'bleep.biz',
                  },
                  approved: true,
                  has_android_deeplink: true,
                  has_ios_deeplink: false,
                  merchant_id: 'org-YYY',
                  redirect: true,
                },
                null,
              ],
              warnings: [
                null,
                {
                  message: 'Missing required argument: publisher_id',
                  type: 'MissingArgument',
                },
              ],
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 1);
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 1);
        })
        .end(done);
    });
  });

  describe('GET /v1/link/app-action', function() {
    it('returns an app action', function(done) {
      this.request
        .post('/v1/link/app-action')
        .send({
          url: 'http://bloop.com',
          publisher_id: 'org-XXX',
          platform: 'ios',
          attribution_token: 'srctok-XXX',
        })
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              object: {
                app_action: {
                  app_link: 'bloop:///?btn_ref=srctok-XXX',
                  browser_link: 'https://bloop.com?btn_ref=srctok-XXX',
                },
                approved: true,
                merchant_id: 'org-YYY',
                redirect: true,
              },
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 1);
          assert.deepEqual(
            this.kokiriAdapter.maybeRedirect.args[0][1],
            'http://bloop.com'
          );
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 1);
          assert.deepEqual(this.kokiriAdapter.linkAttributes.args[0], [
            'http://bleep.biz',
            'org-XXX',
          ]);
          assert.equal(this.kokiriAdapter.appAction.callCount, 1);
          assert.deepEqual(
            this.kokiriAdapter.appAction.args[0][0],
            'http://bleep.biz'
          );
          assert.deepEqual(this.kokiriAdapter.appAction.args[0][1], 'org-XXX');
          assert.deepEqual(this.kokiriAdapter.appAction.args[0][2], 'ios');
          assert.deepEqual(
            this.kokiriAdapter.appAction.args[0][3],
            'srctok-XXX'
          );
          assert.deepEqual(
            this.kokiriAdapter.appAction.args[0][5],
            'http://bloop.com'
          );
        })
        .end(done);
    });

    it('returns an app action with errors', function(done) {
      this.request
        .post('/v1/link/app-action')
        .send({
          url: 'http://bloop.com',
          publisher_id: 'org-XXX',
          platform: 'pavel',
          attribution_token: 'srctok-XXX',
        })
        .expect(400)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'error',
            },
            error: {
              message:
                'Invalid argument: platform (must be one of [ios, android])',
              type: 'InvalidArgument',
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 0);
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 0);
          assert.equal(this.kokiriAdapter.appAction.callCount, 0);
        })
        .end(done);
    });

    it('handles null app actions', function(done) {
      this.kokiriAdapter.appAction = async () => Promise.resolve(null);

      this.request
        .post('/v1/link/app-action')
        .send({
          url: 'http://bloop.com',
          publisher_id: 'org-XXX',
          platform: 'android',
          attribution_token: 'srctok-XXX',
        })
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              object: {
                app_action: null,
                approved: true,
                merchant_id: 'org-YYY',
                redirect: true,
              },
            },
          })
        )
        .end(done);
    });

    it('handles redirect failures', function(done) {
      this.kokiriAdapter.maybeRedirect = async () =>
        Promise.resolve({ targetUrl: null });

      this.request
        .post('/v1/link/app-action')
        .send({
          url: 'http://bloop.com',
          publisher_id: 'org-XXX',
          platform: 'android',
          attribution_token: 'srctok-XXX',
        })
        .expect(400)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'error',
            },
            error: {
              message: 'Failed to follow redirects for http://bloop.com',
              type: 'RedirectFailed',
            },
          })
        )
        .end(done);
    });

    it('returns bulk app actions', function(done) {
      this.request
        .post('/v1/link/app-action')
        .send([
          {
            url: 'http://bloop.com',
            publisher_id: 'org-XXX',
            platform: 'ios',
            attribution_token: 'srctok-XXX',
          },
          {
            url: 'http://pup.com',
            publisher_id: 'org-XXX',
            platform: 'android',
            attribution_token: 'srctok-YYY',
          },
        ])
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              objects: [
                {
                  app_action: {
                    app_link: 'bloop:///?btn_ref=srctok-XXX',
                    browser_link: 'https://bloop.com?btn_ref=srctok-XXX',
                  },
                  approved: true,
                  merchant_id: 'org-YYY',
                  redirect: true,
                },
                {
                  app_action: {
                    app_link: 'bloop:///?btn_ref=srctok-XXX',
                    browser_link: 'https://bloop.com?btn_ref=srctok-XXX',
                  },
                  approved: true,
                  merchant_id: 'org-YYY',
                  redirect: false,
                },
              ],
              warnings: [null, null],
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 2);
          assert.deepEqual(
            this.kokiriAdapter.maybeRedirect.args[0][1],
            'http://bloop.com'
          );
          assert.deepEqual(
            this.kokiriAdapter.maybeRedirect.args[1][1],
            'http://pup.com'
          );
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 2);
          assert.deepEqual(this.kokiriAdapter.linkAttributes.args[0], [
            'http://bleep.biz',
            'org-XXX',
          ]);
          assert.deepEqual(this.kokiriAdapter.linkAttributes.args[1], [
            'http://pup.biz',
            'org-XXX',
          ]);
          assert.equal(this.kokiriAdapter.appAction.callCount, 2);
          assert.deepEqual(
            this.kokiriAdapter.appAction.args[0][0],
            'http://bleep.biz'
          );
          assert.deepEqual(this.kokiriAdapter.appAction.args[0][1], 'org-XXX');
          assert.deepEqual(this.kokiriAdapter.appAction.args[0][2], 'ios');
          assert.deepEqual(
            this.kokiriAdapter.appAction.args[0][3],
            'srctok-XXX'
          );
          assert.deepEqual(
            this.kokiriAdapter.appAction.args[0][5],
            'http://bloop.com'
          );
          assert.deepEqual(
            this.kokiriAdapter.appAction.args[1][0],
            'http://pup.biz'
          );
          assert.deepEqual(this.kokiriAdapter.appAction.args[1][1], 'org-XXX');
          assert.deepEqual(this.kokiriAdapter.appAction.args[1][2], 'android');
          assert.deepEqual(
            this.kokiriAdapter.appAction.args[1][3],
            'srctok-YYY'
          );
          assert.deepEqual(
            this.kokiriAdapter.appAction.args[1][5],
            'http://pup.com'
          );
        })
        .end(done);
    });

    it('returns bulk app actions with errors', function(done) {
      this.request
        .post('/v1/link/app-action')
        .send([
          {
            url: 'http://bloop.com',
            publisher_id: 'org-XXX',
            platform: 'ios',
            attribution_token: 'srctok-XXX',
          },
          {
            url: 'pup.com',
            publisher_id: 'org-XXX',
            platform: 'android',
            attribution_token: 'srctok-YYY',
          },
        ])
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              objects: [
                {
                  app_action: {
                    app_link: 'bloop:///?btn_ref=srctok-XXX',
                    browser_link: 'https://bloop.com?btn_ref=srctok-XXX',
                  },
                  approved: true,
                  merchant_id: 'org-YYY',
                  redirect: true,
                },
                null,
              ],
              warnings: [
                null,
                {
                  message: `Invalid argument: url (couldn't parse protocol and hostname)`,
                  type: 'InvalidArgument',
                },
              ],
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 1);
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 1);
          assert.equal(this.kokiriAdapter.appAction.callCount, 1);
        })
        .end(done);
    });
  });

  describe('GET /v1/link/universal', function() {
    it('returns a universal link', function(done) {
      this.request
        .post('/v1/link/universal')
        .send({
          url: 'http://bloop.com',
          publisher_id: 'org-XXX',
          experience: { btn_fallback_exp: 'web' },
          attribution_token: 'srctok-XXX',
        })
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              object: {
                universal_link: 'http://track.bttn.io/bloop',
                approved: true,
                merchant_id: 'org-YYY',
                redirect: true,
              },
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 1);
          assert.deepEqual(
            this.kokiriAdapter.maybeRedirect.args[0][1],
            'http://bloop.com'
          );
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 1);
          assert.deepEqual(this.kokiriAdapter.linkAttributes.args[0], [
            'http://bleep.biz',
            'org-XXX',
          ]);
          assert.equal(this.kokiriAdapter.universalLink.callCount, 1);
          assert.equal(
            this.kokiriAdapter.universalLink.args[0][0],
            'http://bleep.biz'
          );
          assert.equal(this.kokiriAdapter.universalLink.args[0][1], 'org-XXX');
          assert.deepEqual(this.kokiriAdapter.universalLink.args[0][2], {
            btn_fallback_exp: 'web',
          });
          assert.equal(
            this.kokiriAdapter.universalLink.args[0][3],
            'srctok-XXX'
          );
          assert.equal(
            this.kokiriAdapter.universalLink.args[0][5],
            'http://bloop.com'
          );
        })
        .end(done);
    });

    it('returns a universal link with errors', function(done) {
      this.request
        .post('/v1/link/universal')
        .send({ publisher_id: 'org-XXX' })
        .expect(400)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'error',
            },
            error: {
              message: 'Missing required argument: url',
              type: 'MissingArgument',
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 0);
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 0);
          assert.equal(this.kokiriAdapter.universalLink.callCount, 0);
        })
        .end(done);
    });

    it('handles redirect failures', function(done) {
      this.kokiriAdapter.maybeRedirect = async () =>
        Promise.resolve({ targetUrl: null });

      this.request
        .post('/v1/link/universal')
        .send({
          url: 'http://bloop.com',
          publisher_id: 'org-XXX',
          attribution_token: 'srctok-XXX',
        })
        .expect(400)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'error',
            },
            error: {
              message: 'Failed to follow redirects for http://bloop.com',
              type: 'RedirectFailed',
            },
          })
        )
        .end(done);
    });

    it('returns bulk universal links', function(done) {
      this.request
        .post('/v1/link/universal')
        .send([
          {
            url: 'http://bloop.com',
            publisher_id: 'org-XXX',
            experience: { btn_fallback_exp: 'web' },
            attribution_token: 'srctok-XXX',
          },
          {
            url: 'http://pup.com',
            publisher_id: 'org-XXX',
            attribution_token: 'srctok-YYY',
          },
        ])
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              objects: [
                {
                  universal_link: 'http://track.bttn.io/bloop',
                  approved: true,
                  merchant_id: 'org-YYY',
                  redirect: true,
                },
                {
                  universal_link: 'http://track.bttn.io/bloop',
                  approved: true,
                  merchant_id: 'org-YYY',
                  redirect: false,
                },
              ],
              warnings: [null, null],
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 2);
          assert.deepEqual(
            this.kokiriAdapter.maybeRedirect.args[0][1],
            'http://bloop.com'
          );
          assert.deepEqual(
            this.kokiriAdapter.maybeRedirect.args[1][1],
            'http://pup.com'
          );
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 2);
          assert.deepEqual(this.kokiriAdapter.linkAttributes.args[0], [
            'http://bleep.biz',
            'org-XXX',
          ]);
          assert.deepEqual(this.kokiriAdapter.linkAttributes.args[1], [
            'http://pup.biz',
            'org-XXX',
          ]);
          assert.equal(this.kokiriAdapter.universalLink.callCount, 2);
          assert.equal(
            this.kokiriAdapter.universalLink.args[0][0],
            'http://bleep.biz'
          );
          assert.equal(this.kokiriAdapter.universalLink.args[0][1], 'org-XXX');
          assert.deepEqual(this.kokiriAdapter.universalLink.args[0][2], {
            btn_fallback_exp: 'web',
          });
          assert.equal(
            this.kokiriAdapter.universalLink.args[0][3],
            'srctok-XXX'
          );
          assert.equal(
            this.kokiriAdapter.universalLink.args[0][5],
            'http://bloop.com'
          );
          assert.equal(
            this.kokiriAdapter.universalLink.args[1][0],
            'http://pup.biz'
          );
          assert.equal(this.kokiriAdapter.universalLink.args[1][1], 'org-XXX');
          assert.deepEqual(
            this.kokiriAdapter.universalLink.args[1][2],
            undefined
          );
          assert.equal(
            this.kokiriAdapter.universalLink.args[1][3],
            'srctok-YYY'
          );
          assert.equal(
            this.kokiriAdapter.universalLink.args[1][5],
            'http://pup.com'
          );
        })
        .end(done);
    });

    it('returns bulk universal links with errors', function(done) {
      this.request
        .post('/v1/link/universal')
        .send([
          {
            url: 'http://bloop.com',
            publisher_id: 'org-XXX',
            experience: { btn_fallback_exp: 'web' },
            attribution_token: 'srctok-XXX',
          },
          {
            url: 'pup.com',
            publisher_id: 'org-XXX',
            attribution_token: 'srctok-YYY',
          },
        ])
        .expect(200)
        .expect(res =>
          assert.deepEqual(res.body, {
            meta: {
              status: 'ok',
            },
            data: {
              objects: [
                {
                  universal_link: 'http://track.bttn.io/bloop',
                  approved: true,
                  merchant_id: 'org-YYY',
                  redirect: true,
                },
                null,
              ],
              warnings: [
                null,
                {
                  message: `Invalid argument: url (couldn't parse protocol and hostname)`,
                  type: 'InvalidArgument',
                },
              ],
            },
          })
        )
        .expect(() => {
          assert.equal(this.kokiriAdapter.maybeRedirect.callCount, 1);
          assert.equal(this.kokiriAdapter.linkAttributes.callCount, 1);
          assert.equal(this.kokiriAdapter.universalLink.callCount, 1);
        })
        .end(done);
    });
  });
});
