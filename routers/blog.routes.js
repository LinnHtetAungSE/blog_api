const {
  retrieveBlogs,
  retrieveBlogById,
} = require("../controller/blog.controller");
const { checkUpdater } = require("../middleware/check.user.auth");

const router = require("express").Router();

router.get("/", retrieveBlogs);
router.get("/:id", checkUpdater,retrieveBlogById);

module.exports = router;
