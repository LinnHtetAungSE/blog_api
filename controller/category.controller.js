const {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
  checkDuplicateCategory,
} = require("../services/category.service");
const {
  created,
  updated,
  retrieved,
  deleted,
  ok,
} = require("./base.controller");

const retrieveCategories = async (req, res, next) => {
  try {
    const { skip, limit, sortBy, order, name } = req.query;
    const categories = await getCategories(skip, limit, sortBy, order, name);
    return retrieved(res, "Retrieved categories successful", {
      items: categories,
    });
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const savedCategory = await createCategory(
      req.body.data,
      req.body.usertoken.user._id
    );
    return created(res, "Category created successful", {
      category: savedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const modifyCategory = async (req, res, next) => {
  try {
    const savedCategory = await updateCategory(
      req.params.id,
      req.body.usertoken.user._id,
      req.body.data
    );
    return updated(res, "Category updated successful", {
      category: savedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const removeCategory = async (req, res, next) => {
  try {
    const deletedCategory = await deleteCategory(
      req.params.id,
      req.body.usertoken.user._id
    );
    return deleted(res, "Category deleted successful", {
      id: deletedCategory._id,
    });
  } catch (error) {
    next(error);
  }
};

const isNotDuplicateCategory = async (req, res, next) => {
  try {
    const category = await checkDuplicateCategory(req.body.data.value);
    return ok(res, "Check duplicate done", {
      isNotExit: (!category && true) || false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategory,
  modifyCategory,
  retrieveCategories,
  removeCategory,
  isNotDuplicateCategory,
};
