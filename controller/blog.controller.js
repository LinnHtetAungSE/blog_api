const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getBlogById,
  changeStatus,
} = require("../services/blog.service");
const { created, updated, deleted, retrieved } = require("./base.controller");

const retrieveBlogs = async (req, res, next) => {
  try {
    const { skip, limit, sortBy, order, title, categoryName, status } =
      req.query;
    const blogs = await getBlogs(
      skip,
      limit,
      sortBy,
      order,
      title,
      categoryName,
      status
    );
    return retrieved(res, "Blog retrieved successful", { blogs: blogs });
  } catch (error) {
    next(error);
  }
};

const retrieveBlogById = async (req, res, next) => {
  try {
    const blog = await getBlogById(req.params.id);
    return retrieved(res, "Blog retrieved successful", { blog: blog });
  } catch (error) {
    next(error);
  }
};

const addBlog = async (req, res, next) => {
  try {
    const savedBlog = await createBlog(
      req.body.data,
      req.body.usertoken.user._id
    );
    return created(res, "Blog created successful", { blog: savedBlog });
  } catch (error) {
    next(error);
  }
};

const modifyBlog = async (req, res, next) => {
  try {
    const savedBlog = await updateBlog(
      req.params.id,
      req.body.usertoken.user._id,
      req.body.data
    );
    return updated(res, "Blog updated successful", { blog: savedBlog });
  } catch (error) {
    next(error);
  }
};

const removeBlog = async (req, res, next) => {
  try {
    const deletedBlog = await deleteBlog(req.params.id);
    return deleted(res, "Blog deleted successful", {
      id: deletedBlog._id,
    });
  } catch (error) {
    next(error);
  }
};

const modifyBlogStatus = async (req, res, next) => {
  try {
    const changedBlog = await changeStatus(
      req.params.id,
      req.body.data,
      req.body.usertoken.user._id
    );
    return updated(res, "Update blog status successful", { blog: changedBlog });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  retrieveBlogs,
  retrieveBlogById,
  addBlog,
  modifyBlog,
  removeBlog,
  modifyBlogStatus,
};
