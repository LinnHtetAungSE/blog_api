const router = require("express").Router();
const signInSignUpRoutes = require("./signin.signup.routes");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const blogRoutes = require("./blog.routes");
const { checkUser } = require("../middleware/check.user.auth");

router.use("/", signInSignUpRoutes);
router.use("/auth", checkUser, authRoutes);
router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/blog", blogRoutes);

module.exports = router;
