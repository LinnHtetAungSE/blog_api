const { retrieveCategories } = require("../controller/category.controller");

const router = require("express").Router();

router.get("/", retrieveCategories);

module.exports = router;
