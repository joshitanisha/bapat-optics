const Base = require("../helper/exception_handling");
const { HTTPS } = require("../helper/https-status-codes/https-status-codes");
const { Validate } = require("../helper/validation/validations");

const ValidationMiddleware = async (req, res, next) => {
  try {
    const validation = await Validate(req, res);

    if (!validation.status) {
      return Base.sendError(res, HTTPS.BAD_REQUEST, validation.errors);
    }
    next();
  } catch (error) {
    return Base.sendError(res, HTTPS.BAD_REQUEST);
  }
};

module.exports = {
  ValidationMiddleware,
};
