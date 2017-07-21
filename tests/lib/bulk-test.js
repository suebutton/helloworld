const assert = require('assert');
const sinon = require('sinon');

const { mochaAsync } = require('../helpers');

const { bulk } = require('../../lib/bulk');

function getCtx(body) {
  return {
    request: {
      body,
    },
    state: {
      warnings: [],
    },
  };
}

describe('lib/bulk', function() {
  describe('#bulk', function() {
    it(
      'handles non-bulk requests',
      mochaAsync(async () => {
        const handler = sinon.stub().returns({ ok: 'computer' });
        const ctx = getCtx({ bleep: 'ok' });
        await bulk(handler)(ctx);

        assert.equal(handler.callCount, 1);
        assert.deepEqual(handler.args[0][1], { bleep: 'ok' });
        assert.deepEqual(ctx.body, { ok: 'computer' });
      })
    );

    it('handles non-bulk requests that error', function(done) {
      const handler = () => null.bloop();
      const ctx = getCtx({ bleep: 'ok' });

      bulk(handler)(ctx).then(() => done('Should have rejected')).catch(e => {
        assert(e instanceof TypeError);
        done();
      });
    });

    it('handles non-bulk requests that fail >= 500', function(done) {
      const handler = () => {
        const e = new Error('Blooped too hard');
        e.status = 500;
        throw e;
      };
      const ctx = getCtx({ bleep: 'ok' });

      bulk(handler)(ctx).then(() => done('Should have rejected')).catch(e => {
        assert(e instanceof Error);
        done();
      });
    });

    it(
      'handles bulk requests that succeed',
      mochaAsync(async () => {
        const handler = sinon.stub().returns({ ok: 'computer' });
        const ctx = getCtx([{ bleep: 'ok' }, { bloop: 'not-ok' }]);
        await bulk(handler)(ctx);

        assert.equal(handler.callCount, 2);
        assert.deepEqual(handler.args[0][1], { bleep: 'ok' });
        assert.deepEqual(handler.args[1][1], { bloop: 'not-ok' });
        assert.deepEqual(ctx.body, [{ ok: 'computer' }, { ok: 'computer' }]);
        assert.deepEqual(ctx.state.warnings, [null, null]);
      })
    );

    it(
      'handles bulk requests that fail',
      mochaAsync(async () => {
        const handler = (ctx, body) => {
          if (body.bloop === 'not-ok') {
            const e = new Error('Not okay to bloop');
            e.status = 403;
            throw e;
          }

          return 'cool';
        };

        const ctx = getCtx([{ bleep: 'ok' }, { bloop: 'not-ok' }]);
        await bulk(handler)(ctx);

        assert.deepEqual(ctx.body, ['cool', null]);
        assert.deepEqual(ctx.state.warnings[0], null);
        assert.deepEqual(ctx.state.warnings[1].message, 'Not okay to bloop');
      })
    );

    it('handles bulk requests that error', function(done) {
      const handler = (ctx, body) => {
        if (body.bloop === 'not-ok') {
          null.bloop();
        }

        return 'cool';
      };

      const ctx = getCtx([{ bleep: 'ok' }, { bloop: 'not-ok' }]);

      bulk(handler)(ctx).then(() => done('Should have rejected')).catch(e => {
        assert(e instanceof TypeError);
        done();
      });
    });
  });
});
