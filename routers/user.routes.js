const {
  retrieveUserById,
  retrieveUsers,
  isNotDuplicateUser,
} = require("../controller/user.controller");

const router = require("express").Router();

router.get("/", retrieveUsers);
router.get("/:id", retrieveUserById);
router.post("/check_duplicate", isNotDuplicateUser);

module.exports = router;
