const {
  signin_validate_schema,
  signup_validate_schema,
} = require("./user.validate");

module.exports = {
  "/signin": signin_validate_schema,
  "/signup": signup_validate_schema,
};
