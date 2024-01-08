const {
  invalidError,
  alreadyExistsError,
  unprocessableError,
  invalidIdError,
  unauthorizedError,
  itemNotFoundError,
} = require("../errors/db.error");
const { CastError } = require("mongoose");
const User = require("../models/user.model");
const { getBcryptPassword, validatePassword } = require("../utils/Bcrypt");
const { checkId, getObjectId } = require("./base.service");

const getUsers = async (isDeleted) => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw error;
  }
};

const validateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    console.log("User", user);
    if (user.status !== "ACTIVE") {
      throw unauthorizedError("Account was suspened");
    }
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw unauthorizedError("Wrong credentials");
    }
    return user;
  } catch (error) {
    if (error.message === "Account was suspened") {
      throw unauthorizedError("Account was suspened");
    }
    throw unauthorizedError("Wrong credentials");
    // throw unprocessableError("Failed to create user");
  }
};

const createUser = async (inputUser, creatorId) => {
  try {
    const bcryptPassword = await getBcryptPassword(inputUser.password);
    const user = new User({
      ...inputUser,
      password: bcryptPassword,
      creator: creatorId ? getObjectId(creatorId) : null,
      updater: null,
    });
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw invalidError("Validation Error: " + error.message);
    }
    if (error.code === 11000) {
      const duplicatedFields = Object.keys(error.keyPattern).join(" and ");
      const duplicateErrorMessage = `User with ${duplicatedFields} already exists`;
      throw alreadyExistsError(`Duplicate Key Error: ${duplicateErrorMessage}`);
    }
    if (error instanceof CastError && error.path === "_id") {
      throw invalidIdError(
        `Invalid ID: ${error.value} is not a valid ObjectId`
      );
    }

    throw unprocessableError("Failed to create user");
  }
};

const updateUser = async (id, updaterId, inputUser) => {
  try {
    const bcryptPassword = await getBcryptPassword(inputUser.password);
    await checkId(id, User, `User with id ${id} not found`);
    const savedUser = await User.findByIdAndUpdate(id, {
      ...inputUser,
      password: bcryptPassword,
      updater: await getObjectId(updaterId),
    });
    if (!savedUser) {
      return null;
    }
    return savedUser;
  } catch (error) {
    if (error.name && error.name === "ValidationError") {
      throw invalidError("Validation Error: " + error.message);
    }
    if (error.name === "INVALID_ID") {
      throw itemNotFoundError(error.message);
    }
    if (error.code === 11000) {
      throw alreadyExistsError(
        "Duplicate Key Error: Another user with the same data exists"
      );
    }
    if (error instanceof CastError && error.path === "_id") {
      throw invalidIdError(
        `Invalid ID: ${error.value} is not a valid ObjectId`
      );
    }
    throw unprocessableError("Failed to update user");
  }
};

const deleteUser = async (id, updaterId) => {
  try {
    await checkId(id, User, `User with id ${id} not found`);
    const deletedUser = await User.findByIdAndUpdate(id, {
      isDeleted: true,
      updater: await getObjectId(updaterId),
    });
    if (!deletedUser) {
      return null;
    }
    return deletedUser;
  } catch (error) {
    if (error.name === "INVALID_ID") {
      throw itemNotFoundError(error.message);
    }
    if (error instanceof CastError && error.path === "_id") {
      throw invalidIdError(
        `Invalid ID: ${error.value} is not a valid ObjectId`
      );
    }
    throw unprocessableError("Failed to delete user");
  }
};

module.exports = {
  getUsers,
  validateUser,
  createUser,
  updateUser,
  deleteUser,
};
