const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Run after express-validator rules.
 * Returns 422 with field-level error details if validation fails.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return sendError(res, 'Validation failed', 422, formatted);
  }
  next();
};

module.exports = { handleValidationErrors };
