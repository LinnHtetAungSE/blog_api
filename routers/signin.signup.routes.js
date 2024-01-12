const { signupUser, signinUser } = require("../controller/user.controller");
const { schemaValidator } = require("../middleware/schema.validator");

const router = require("express").Router();

router.post("/signup", schemaValidator("/user"), signupUser);
router.post("/signin", schemaValidator("/signin"), signinUser);

module.exports = router;
