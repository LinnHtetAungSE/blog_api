const {
  validateUser,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  toggleStatus,
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
    const savedUser = await createUser(req.body.data);
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
    const { email, password } = req.body.data;

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
    console.log(req.body);
    const savedUser = await updateUser(
      req.params.id,
      req.body.usertoken.user._id,
      req.body.data
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
    const user = req.body.usertoken.user;
    if (user.role === "ADMIN" && req.params.id === user._id) {
      return error(res, "Cannot delete yourself", null);
    }
    const deletedUser = await deleteUser(req.params.id, user._id);
    if (deletedUser) {
      return deleted(res, "Delete Successful", { id: deletedUser._id });
    }
    throw itemNotFoundError("User not found");
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const user = req.body.usertoken.user;
    console.log("User", user);
    if (user.role === "ADMIN" && req.params.id === user._id) {
      return error(res, "Cannot change status of yourself", null);
    }
    const savedUser = await toggleStatus(req.params.id, user._id);
    if (savedUser) {
      return updated(res, "Status change Successful", { id: savedUser._id });
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
  changeStatus,
};
