const jwt = require("jsonwebtoken");
const Base = require("../helper/exception_handling");
const { HTTPS } = require("../helper/https-status-codes/https-status-codes");
const IDS = require("../helper/fix_ids");

const AuthMiddleware = async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return Base.sendError(res, HTTPS.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded;
    req.user.ip = req.ip;
    next();
  } catch (error) {
    return Base.sendError(res, HTTPS.UNAUTHORIZED, error?.message);
  }
};

const AuthMiddlewareVendor = async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return Base.sendError(res, HTTPS.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded;
    req.user.ip = req.ip;
    if (decoded.role_id === IDS.RoleId.Vendor) {
      next();
    } else {
      return Base.sendError(res, HTTPS.UNAUTHORIZED, "Not a vendor");
    }
  } catch (error) {
    return Base.sendError(res, HTTPS.UNAUTHORIZED, error?.message);
  }
};

const AuthMiddlewareCustomer = async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return Base.sendError(res, HTTPS.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded;
    req.user.ip = req.ip;
    if (decoded.role_id === IDS.RoleId.Customer) {
      next();
    } else if (decoded.role_id === IDS.RoleId.Doctor) {
      next();
    } else {
      return Base.sendError(res, HTTPS.UNAUTHORIZED, "Not a customer");
    }
  } catch (error) {
    return Base.sendError(res, HTTPS.UNAUTHORIZED, error?.message);
  }
};

module.exports = {
  AuthMiddleware,
  AuthMiddlewareVendor,
  AuthMiddlewareCustomer,
};
