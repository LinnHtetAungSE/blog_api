const {
  addCategory,
  modifyCategory,
  removeCategory,
  isNotDuplicateCategory,
} = require("../controller/category.controller");
const { checkValidUser } = require("../middleware/check.user.auth");

const router = require("express").Router();

router.post("/create", checkValidUser, addCategory);
router.patch("/:id", checkValidUser, modifyCategory);
router.delete("/:id", checkValidUser, removeCategory);
router.post("/check_duplicate", isNotDuplicateCategory);

module.exports = router;
