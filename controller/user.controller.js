const {
  validateUser,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../services/user.service");
const jwt = require("jsonwebtoken");
const {
  error,
  ok,
  created,
  updated,
  unauthorized,
  deleted,
  retrieved,
} = require("./base.controller");
const { itemNotFoundError, unauthorizedError } = require("../errors/db.error");

const retrieveUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    return retrieved(res, "Retrieved users successful", { users: users });
  } catch (error) {
    next(error);
  }
};

const signupUser = async (req, res, next) => {
  try {
    const savedUser = await createUser(req.body);
    if (savedUser) {
      return created(res, "Registration Successful", { user: savedUser });
    }
    return error(res, "Registration Failed", savedUser);
  } catch (error) {
    next(error);
  }
};

const signinUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await validateUser(email, password);

    if (!user) {
      return unauthorized(res, "Invalid credentials", null);
    }

    const token = jwt.sign({ user }, process.env.SECRETKEY, {
      expiresIn: "1h",
    });
    return ok(res, "Signin successful", { token: token });
  } catch (error) {
    next(error);
  }
};
const modifyUser = async (req, res, next) => {
  try {
    const userToken = req.headers.usertoken;
    let decodedToken;
    try {
      decodedToken = jwt.verify(userToken, process.env.SECRETKEY);
      if (
        decodedToken.user.role !== "ADMIN" &&
        req.params.id !== decodedToken.user._id
      ) {
        return unauthorized(
          res,
          "You are not authorized to modify this user",
          null
        );
      }
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        return unauthorized(res, "Invalid token:" + jwtError.message, null);
      }
      throw jwtError;
    }
    const savedUser = await updateUser(
      req.params.id,
      decodedToken.user._id,
      req.body
    );
    if (savedUser) {
      return updated(res, "Update Successful", { user: savedUser });
    }
    throw itemNotFoundError("User not found");
  } catch (error) {
    next(error);
  }
};

const disableUser = async (req, res, next) => {
  try {
    const userToken = req.headers.usertoken;
    let decodedToken;
    try {
      decodedToken = jwt.verify(userToken, process.env.SECRETKEY);
      if (
        decodedToken.user.role !== "ADMIN" &&
        req.params.id !== decodedToken.user._id
      ) {
        return unauthorized(
          res,
          "You are not authorized to delete this user",
          null
        );
      }
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        return unauthorized(res, "Invalid token:" + jwtError.message);
      }
      throw jwtError;
    }
    const deletedUser = await deleteUser(req.params.id, decodedToken.user._id);
    if (deletedUser) {
      return deleted(res, "Delete Successful", { id: deletedUser._id });
    }
    throw itemNotFoundError("User not found");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  retrieveUsers,
  signupUser,
  signinUser,
  modifyUser,
  disableUser,
};
