const { validationResult } = require("express-validator");

function validate(req, _res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next({
      statusCode: 422,
      message: "Validation failed",
      errors: result.array(),
    });
  }
  return next();
}

module.exports = validate;
