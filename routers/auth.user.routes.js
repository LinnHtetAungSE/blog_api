const {
  disableUser,
  modifyUser,
  changeStatus,
} = require("../controller/user.controller");
const { checkValidUser } = require("../middleware/check.user.auth");
const { schemaValidator } = require("../middleware/schema.validator");
const { getUsers } = require("../services/user.service");
const router = require("express").Router();

router.get("/", checkValidUser, getUsers);
router.patch("/:id", checkValidUser, schemaValidator("/signup"), modifyUser);
router.patch("/change_status/:id", checkValidUser, changeStatus);
router.delete("/:id", checkValidUser, disableUser);

module.exports = router;
