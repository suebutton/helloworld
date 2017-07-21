const { isPlainObject, isString } = require('lodash');

/**
 * @param  {Object|Array} data
 * @param  {?Array} warnings
 * @return {Object}
 */
function viewSuccess(data, warnings) {
  return {
    meta: { status: 'ok' },
    data: viewData(data, warnings),
  };
}

/**
 * @param  {Object|Array} data
 * @param  {?Array} warnings
 * @return {Object}
 */
function viewData(data, warnings) {
  const response = {};

  if (Array.isArray(data)) {
    response.objects = data;
    response.warnings = viewWarnigns(warnings);
  } else if (isPlainObject(data)) {
    response.object = data;
  }

  return response;
}

/**
 * @param  {?Array} warnings
 * @return {Array}
 */
function viewWarnigns(warnings) {
  if (Array.isArray(warnings)) {
    return warnings.map(viewError);
  }

  return [];
}

/**
 * TODO(will) move this upstream to baseweb
 *
 * @param  {Error} error
 * @return {Object}
 */
function viewError(error) {
  if (!error) {
    return null;
  }

  const response = { message: null };

  if (isString(error.message)) {
    response.message = error.message;
  }

  if (isString(error.type)) {
    response.type = error.type;
  }

  if (isPlainObject(error.details)) {
    response.details = error.details;
  }

  return response;
}

module.exports = {
  viewSuccess,
};
