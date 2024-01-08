const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.usertoken;
    const decode = jwt.verify(token, process.env.SECRETEKEY);
    req.body.usertoken = decode;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

exports.checkValidUser = (userToken, userId, res) => {
  try {
    decodedToken = jwt.verify(userToken, process.env.SECRETKEY);
    if (
      decodedToken.user.role !== "ADMIN" &&
      userId !== decodedToken.user._id
    ) {
      return unauthorized(
        res,
        "You are not authorized to delete this user",
        null
      );
    }
  } catch (jwtError) {
    if (jwtError instanceof jwt.JsonWebTokenError) {
      return unauthorized(res, "Invalid token:" + jwtError.message, null);
    }
    throw jwtError;
  }
};
