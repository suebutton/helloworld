const assert = require('assert');
const sinon = require('sinon');
const nock = require('nock');

const { mochaAsync } = require('../helpers');

const { redirect } = require('../../lib/redirect');

describe('lib/redirect', function() {
  describe('#redirect', function() {
    beforeEach(function() {
      this.redis = { getSet: sinon.spy() };
    });

    it(
      'handles redirects by invoking redis',
      mochaAsync(async function() {
        await redirect(this.redis, 'bloop.com', 'http://bloop.com');

        assert.equal(this.redis.getSet.callCount, 1);
        assert.deepEqual(this.redis.getSet.args[0][0], 'urlredirect');
        assert.deepEqual(this.redis.getSet.args[0][1], 'bloop.com');
        assert.deepEqual(this.redis.getSet.args[0][3], 345600);

        const work = this.redis.getSet.args[0][2];

        const initialCall = nock('http://bloop.com')
          .get('/')
          .reply(302, undefined, { Location: 'http://bleep.biz/tada' });

        const redirectCall = nock('http://bleep.biz').get('/tada').reply(200);

        const result = await work();

        assert.deepEqual(result, 'http://bleep.biz/tada');

        initialCall.done();
        redirectCall.done();
      })
    );
  });
});
