const {
  disableUser,
  modifyUser,
  changeStatus,
} = require("../controller/user.controller");
const { checkValidUser } = require("../middleware/check.user.auth");
const { schemaValidator } = require("../middleware/schema.validator");
const router = require("express").Router();

router.patch("/:id", checkValidUser, schemaValidator("/user"), modifyUser);
router.patch("/change_status/:id", checkValidUser, changeStatus);
router.delete("/:id", checkValidUser, disableUser);

module.exports = router;
