const router = require("express").Router();
const { schemaValidator } = require("../middleware/schema.validator");
const { modifyUser, retrieveUsers } = require("../controller/user.controller");

router.get("/", retrieveUsers);
router.patch("/:id", schemaValidator("/signup"), modifyUser);

module.exports = router;
