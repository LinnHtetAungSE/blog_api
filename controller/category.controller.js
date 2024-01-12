const {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
} = require("../services/category.service");
const { created, updated, retrieved, deleted } = require("./base.controller");

const retrieveCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    return retrieved(res, "Retrieved categories successful", {
      categories: categories,
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
    const deletedCategory = await deleteCategory(req.params.id);
    return deleted(res, "Category deleted successful", {
      id: deletedCategory._id,
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
};
