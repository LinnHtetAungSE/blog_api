const router = require("express").Router();
const authUserRoutes = require("./auth.user.routes");
const authCategoryRoutes = require("./auth.category.routes");
const authBlogRoutes = require("./auth.blog.routes");

router.use("/user", authUserRoutes);
router.use("/category", authCategoryRoutes);
router.use("/blog", authBlogRoutes);

module.exports = router;
