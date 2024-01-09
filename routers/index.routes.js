const router = require("express").Router();
const signInSignUpRoutes = require("./signin.signup.routes");
const authRoutes = require("./auth.routes");
const { checkUser } = require("../middleware/check.user.auth");

router.use("/", signInSignUpRoutes);
router.use("/auth", checkUser, authRoutes);

module.exports = router;
