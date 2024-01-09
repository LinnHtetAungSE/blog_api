const jwt = require("jsonwebtoken");
const { unauthorized } = require("../controller/base.controller");
const { notAcceptableError } = require("../errors/db.error");

exports.checkUser = (req, res, next) => {
  try {
    const token = req.headers.usertoken;
    const decode = jwt.verify(token, process.env.SECRETKEY);
    req.body.usertoken = decode;
    next();
  } catch (error) {
    console.log("ERROR", error.name, error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return unauthorized(res, "Invalid token:" + error.message, null);
    }
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

exports.checkValidUser = (req, res, next) => {
  try {
    const user = req.body.usertoken.user;
    console.log("Middleware", user);
    if (user.status !== "ACTIVE") {
      return unauthorized(res, "Your account was suspended", null);
    }
    if (user.role !== "ADMIN" && req.params.id !== user._id) {
      return unauthorized(res, "You are not authorized to this action", null);
    }
    next();
  } catch (error) {
    console.log("ERROR", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return unauthorized(res, "Invalid token:" + error.message, null);
    }
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
