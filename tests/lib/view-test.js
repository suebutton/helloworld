const assert = require('assert');

const { viewSuccess } = require('../../lib/view');

describe('lib/view', function() {
  describe('#viewSuccess', function() {
    it('returns a formatted success object', function() {
      assert.deepEqual(viewSuccess({}), {
        meta: {
          status: 'ok',
        },
        data: {
          object: {},
        },
      });

      assert.deepEqual(viewSuccess(null), {
        meta: {
          status: 'ok',
        },
        data: {},
      });

      assert.deepEqual(viewSuccess({ ok: 'computer' }), {
        meta: {
          status: 'ok',
        },
        data: {
          object: { ok: 'computer' },
        },
      });

      assert.deepEqual(viewSuccess([{ ok: 'computer' }]), {
        meta: {
          status: 'ok',
        },
        data: {
          objects: [{ ok: 'computer' }],
          warnings: [],
        },
      });

      assert.deepEqual(viewSuccess([{ ok: 'computer' }], [null]), {
        meta: {
          status: 'ok',
        },
        data: {
          objects: [{ ok: 'computer' }],
          warnings: [null],
        },
      });

      assert.deepEqual(viewSuccess([{ ok: 'computer' }], [{}]), {
        meta: {
          status: 'ok',
        },
        data: {
          objects: [{ ok: 'computer' }],
          warnings: [{ message: null }],
        },
      });

      assert.deepEqual(
        viewSuccess(
          [{ ok: 'computer' }],
          [{ message: 'message', type: 'type', details: { detail: true } }]
        ),
        {
          meta: {
            status: 'ok',
          },
          data: {
            objects: [{ ok: 'computer' }],
            warnings: [
              { message: 'message', type: 'type', details: { detail: true } },
            ],
          },
        }
      );

      assert.deepEqual(
        viewSuccess(
          [{ ok: 'computer' }],
          [{ message: [], type: new Date(), details: false }]
        ),
        {
          meta: {
            status: 'ok',
          },
          data: {
            objects: [{ ok: 'computer' }],
            warnings: [{ message: null }],
          },
        }
      );
    });
  });
});
