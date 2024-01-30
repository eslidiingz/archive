const { validationResult } = require("express-validator");

// Import Validators
const user = require("./user");
const ranking = require("./ranking");

const validators = {
  user,
  ranking,
};

module.exports = {
  check(req, res, next) {
    let errors = validationResult(req).array();
    if (errors.length == 0) return next();
    let error = new Error();
    error.message = errors;
    error.status = 422;
    throw error;
  },
  ...validators,
};
