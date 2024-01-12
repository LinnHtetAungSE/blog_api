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
const {
  checkId,
  getObjectId,
  addConditionToCriteria,
  getPaginatedItems,
} = require("./base.service");
const { userStatus } = require("../constants/enum");

const getUsers = async (
  skip,
  limit,
  sortBy,
  order,
  username,
  email,
  phoneNumber,
  role,
  status,
  description
) => {
  try {
    let criteria = {};
    criteria = addConditionToCriteria(
      criteria,
      "username",
      username ? { $eq: username } : null
    );

    criteria = addConditionToCriteria(
      criteria,
      "email",
      email ? { $eq: email } : null
    );

    criteria = addConditionToCriteria(
      criteria,
      "phoneNumber",
      phoneNumber ? { $eq: phoneNumber } : null
    );

    criteria = addConditionToCriteria(
      criteria,
      "role",
      role ? { $eq: role } : null
    );

    criteria = addConditionToCriteria(
      criteria,
      "status",
      status ? { $eq: status } : null
    );

    criteria = addConditionToCriteria(
      criteria,
      "description",
      description ? { $regex: new RegExp(`.*${description}.*`, "i") } : null
    );

    const users = await getPaginatedItems(
      User,
      skip,
      limit,
      sortBy,
      order,
      "",
      criteria
    );
    return users;
  } catch (error) {
    throw unprocessableError("Failed to retrieve users");
  }
};

const getUserById = async (id) => {
  try {
    await checkId(id, User, `User with id ${id} not found`);
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.log(error);
    if (error instanceof CastError && error.path === "_id") {
      throw invalidIdError("INVALID_ID");
    }
    if (error.name === "INVALID_ID") {
      throw itemNotFoundError(error.message);
    }
    throw unprocessableError("Failed to retrieve user");
  }
};

const validateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw unauthorizedError("Wrong credentials");
    }
    if (user.status !== "ACTIVE") {
      throw unauthorizedError("Account was suspened");
    }
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw unauthorizedError("Wrong credentials");
    }
    return user;
  } catch (error) {
    console.log(error);
    if (error.message === "Account was suspened") {
      throw unauthorizedError("Account was suspened");
    }
    if (error.name === "UNAUTHORIZED" || error.status < 500) {
      throw unauthorizedError("Wrong credentials");
    }
    throw unprocessableError("Failed to validate user");
  }
};

const createUser = async (inputUser, creatorId) => {
  try {
    const bcryptPassword = await getBcryptPassword(inputUser.password);
    const user = new User({
      ...inputUser,
      password: bcryptPassword,
      creator: creatorId ? await getObjectId(creatorId) : null,
      updater: null,
    });
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    console.log("ERROR", error);
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
    if (error.name === "INVALID_ID") {
      throw invalidIdError(error.message);
    }
    throw unprocessableError("Failed to create user");
  }
};

const updateUser = async (id, updaterId, inputUser) => {
  try {
    await checkId(id, User, `User with id ${id} not found`);
    const bcryptPassword = await getBcryptPassword(inputUser.password);
    const savedUser = await User.findByIdAndUpdate(
      id,
      {
        ...inputUser,
        password: bcryptPassword,
        updater: await getObjectId(updaterId),
      },
      {
        new: true,
      }
    );
    if (!savedUser) {
      return null;
    }
    return savedUser;
  } catch (error) {
    console.log("Error", error);
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
    if (error.name === "INVALID_ID") {
      throw invalidIdError(error.message);
    }
    throw unprocessableError("Failed to update user");
  }
};

const deleteUser = async (id, updaterId) => {
  try {
    await checkId(id, User, `User with id ${id} not found`);
    const deletedUser = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        updater: await getObjectId(updaterId),
      },
      { new: true }
    );
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
    if (error.name === "INVALID_ID") {
      throw invalidIdError(error.message);
    }
    throw unprocessableError("Failed to delete user");
  }
};

const toggleStatus = async (id, updaterId) => {
  try {
    await checkId(id, User, `User with id ${id} not found`);
    const user = await User.findById(id);
    const status =
      user.status === userStatus.ACTIVE
        ? userStatus.SUSPENDED
        : userStatus.ACTIVE;
    const changedUser = await User.findByIdAndUpdate(
      id,
      {
        status: status,
        updater: await getObjectId(updaterId),
      },
      { new: true }
    );
    if (!changedUser) {
      return null;
    }
    return changedUser;
  } catch (error) {
    console.log("ERROR", error);
    if (error.name === "INVALID_ID") {
      throw itemNotFoundError(error.message);
    }
    if (error instanceof CastError && error.path === "_id") {
      throw invalidIdError(
        `Invalid ID: ${error.value} is not a valid ObjectId`
      );
    }
    if (error.name === "INVALID_ID") {
      throw invalidIdError(error.message);
    }
    throw unprocessableError("Failed to change status user");
  }
};

module.exports = {
  getUsers,
  getUserById,
  validateUser,
  createUser,
  updateUser,
  deleteUser,
  toggleStatus,
};
