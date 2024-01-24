const { blog_validate_schema } = require("./blog.validate");
const {
  signin_validate_schema,
  user_validate_schema,
} = require("./user.validate");

module.exports = {
  "/signin": signin_validate_schema,
  "/user": user_validate_schema,
  "/blog": blog_validate_schema,
};
