const { blogStatus } = require("../constants/enum");
const {
  invalidError,
  invalidIdError,
  unprocessableError,
  alreadyExistsError,
} = require("../errors/db.error");
const Blog = require("../models/blog.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const {
  checkId,
  getObjectId,
  addConditionToCriteria,
  getPaginatedItems,
} = require("./base.service");
const { CastError } = require("mongoose");

const getBlogs = async (
  skip,
  limit,
  sortBy,
  order,
  title,
  categoryName,
  status
) => {
  try {
    let criteria = {};

    criteria = addConditionToCriteria(
      criteria,
      "title",
      title ? { $regex: new RegExp(`.*${title}.*`, "i") } : null
    );

    criteria = addConditionToCriteria(
      criteria,
      "status",
      status ? status : null
    );

    const categories = await Category.find({ name: { $in: categoryName } });

    if (categories.length > 0) {
      criteria = addConditionToCriteria(criteria, "categoryList", {
        $in: categories.map((category) => category._id),
      });
    }

    const blogs = await getPaginatedItems(
      Blog,
      skip,
      limit,
      sortBy,
      order,
      [
        {
          path: "categoryList",
          select: "name",
        },
        {
          path: "creator",
          select: "username email description",
        },
      ],
      criteria
    );
    return blogs;
  } catch (error) {
    console.log(error);
    throw unprocessableError("Fail to retrieve blogs");
  }
};

const getBlogById = async (id) => {
  try {
    await checkId(id, Blog, `Blog with id ${id} not found`);
    const blog = await Blog.findById(id).populate("categoryList");
    return blog;
  } catch (error) {
    if (error instanceof CastError && error.path === "_id") {
      throw invalidIdError("INVALID_ID");
    }

    throw unprocessableError("Failed to retrieve blog");
  }
};

const createBlog = async (inputBlog, creatorId) => {
  try {
    await checkId(creatorId, User, `User with id ${creatorId} not found`);
    const blog = new Blog({
      ...inputBlog,
      creator: creatorId,
      updater: creatorId,
    });
    const savedBlog = await blog.save();
    return savedBlog;
  } catch (error) {
    console.log("ERROR", error);
    if (error.name === "ValidationError") {
      throw invalidError("Validation Error: " + error.message);
    }
    if (error.code === 11000) {
      const duplicatedFields = Object.keys(error.keyPattern).join(" and ");
      const duplicateErrorMessage = `Blog with ${duplicatedFields} already exists`;
      throw alreadyExistsError(`Duplicate Key Error: ${duplicateErrorMessage}`);
    }
    if (error instanceof CastError && error.path === "_id") {
      throw invalidIdError("INVALID_ID");
    }

    throw unprocessableError("Failed to create blog");
  }
};

const updateBlog = async (id, updaterId, inputBlog) => {
  try {
    await checkId(id, Blog, `Blog with id ${id} not found`);
    const savedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        ...inputBlog,
        updater: updaterId,
      },
      { new: true }
    );
    return savedBlog;
  } catch (error) {
    console.log("ERROR", error);
    if (error.name === "ValidationError") {
      throw invalidError("Validation Error: " + error.message);
    }
    if (error.code === 11000) {
      const duplicatedFields = Object.keys(error.keyPattern).join(" and ");
      const duplicateErrorMessage = `Blog with ${duplicatedFields} already exists`;
      throw alreadyExistsError(`Duplicate Key Error: ${duplicateErrorMessage}`);
    }
    if (error instanceof CastError && error.path === "_id") {
      throw invalidIdError("INVALID_ID");
    }
    if (error.name === "INVALID_ID") {
      throw invalidIdError(error.message);
    }
    throw unprocessableError("Failed to update blog");
  }
};

const deleteBlog = async (id, updaterId) => {
  try {
    await checkId(id, Blog, `Blog with id ${id} doesn't exit`);
    const deletedBlog = await Blog.findByIdAndDelete(id);
    return deletedBlog;
  } catch (error) {
    console.log("ERROR", error);
    if (error.name === "ValidationError") {
      throw invalidError("Validation Error: " + error.message);
    }
    if (error instanceof CastError && error.path === "_id") {
      throw invalidIdError("INVALID_ID");
    }
    if (error.name === "INVALID_ID") {
      throw invalidIdError(error.message);
    }
    throw unprocessableError("Failed to delete blog");
  }
};

const changeStatus = async (id, status, updaterId) => {
  try {
    console.log("Status", status);
    await checkId(id, Blog, `Blog with id ${id} not found`);
    const isValidStatus = Blog.schema
      .path("status")
      .enumValues.includes(status);

    if (!isValidStatus) {
      throw unprocessableError(`Invalid status: ${status}`);
    }
    const changedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        status: status,
        updater: await getObjectId(updaterId),
      },
      { new: true }
    );
    console.log(changedBlog);
    if (!changedBlog) {
      return null;
    }
    return changedBlog;
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
    throw unprocessableError("Failed to change status blog");
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  changeStatus,
};
