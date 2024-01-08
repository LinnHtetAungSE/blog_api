const { disableUser } = require("../controller/user.controller");
const router = require("express").Router();

router.delete("/:id", disableUser);

module.exports = router;
