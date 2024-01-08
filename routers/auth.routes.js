const router = require("express").Router();
const authUserRoutes = require("./auth.user.routes");

router.use("/user", authUserRoutes);

module.exports = router;
