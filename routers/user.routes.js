const { retrieveUserById } = require("../controller/user.controller");

const router = require("express").Router();

router.get("/:id", retrieveUserById);

module.exports = router;
