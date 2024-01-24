const jwt = require("jsonwebtoken");
const { unauthorized } = require("../controller/base.controller");
const { notAcceptableError } = require("../errors/db.error");
const User = require("../models/user.model");

exports.checkToken = (req, res, next) => {
  try {
    if (req.headers.accesstoken !== process.env.ACCESSTOKEN) {
      throw new Error("Need access token!!");
    }
    next();
  } catch (error) {
    return unauthorized(res, error.message, null);
  }
};

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
    switch (true) {
      case user.status !== "ACTIVE":
        return unauthorized(res, "Your account was suspended", null);
      // case req.params.id !== user._id || req.body.data.
      case user.status === "ADMIN":
        break;
      case user.role !== "ADMIN" && req.params.id !== user._id:
        return unauthorized(res, "You are not authorized to this action", null);
      default:
        break;
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

exports.checkUpdater = async (Model, req, res, next) => {
  try {
    const updater = await User.findById(req.body.usertoken.user);
    const item = await Model.findById(req.params.id);

    if (!updater || !item) {
      throw unauthorized(res, "Invalid user or item", null);
    }

    if (
      updater._id.toString() !== item.creator.toString() &&
      updater.role !== "ADMIN"
    ) {
      throw unauthorized(res, "You are not authorized to this action", null);
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
