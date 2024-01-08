const router = require("express").Router();
const signInSignUpRoutes = require("./signin.signup.routes");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

router.use("/", signInSignUpRoutes);
router.use("/user", userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
