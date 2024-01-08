const Joi = require("joi");
const { roles, userStatus } = require("../constants/enum");

const PASSWORD_REGEX = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const signup_validate_schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(PASSWORD_REGEX).required(),
  confirm_password: Joi.ref("password"),
  email: Joi.string().email().required(),
  phone_number: Joi.string(),
  role: Joi.string()
    .valid(roles.ADMIN, roles.USER)
    .default(roles.USER)
    .required(),
  status: Joi.string()
    .valid(userStatus.ACTIVE, userStatus.SUSPENDED)
    .default(userStatus.ACTIVE)
    .required(),
  description: Joi.string(),
});

const signin_validate_schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string(),
});

module.exports = { signin_validate_schema, signup_validate_schema };
