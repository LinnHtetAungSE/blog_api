const router = require("express").Router();
const { checkValidUser } = require("../middleware/check.user.auth");
const authUserRoutes = require("./auth.user.routes");

router.use("/user", authUserRoutes);

module.exports = router;
