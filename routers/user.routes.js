const router = require("express").Router();
const { schemaValidator } = require("../middleware/schema.validator");
const { modifyUser, retrieveUsers } = require("../controller/user.controller");

router.get("/", retrieveUsers);

module.exports = router;
