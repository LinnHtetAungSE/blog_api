const {
  addBlog,
  modifyBlog,
  removeBlog,
  modifyBlogStatus,
} = require("../controller/blog.controller");
const {
  checkValidUser,
  checkUpdater,
} = require("../middleware/check.user.auth");
const { schemaValidator } = require("../middleware/schema.validator");
const Blog = require("../models/blog.model");

const router = require("express").Router();

router.post("/create", schemaValidator("/blog"), addBlog);
router.patch(
  "/:id",
  (req, res, next) => checkUpdater(Blog, req, res, next),
  schemaValidator("/blog"),
  modifyBlog
);
router.delete(
  "/:id",
  (req, res, next) => checkUpdater(Blog, req, res, next),
  removeBlog
);
router.patch("/change_status/:id", checkValidUser, modifyBlogStatus);

module.exports = router;
