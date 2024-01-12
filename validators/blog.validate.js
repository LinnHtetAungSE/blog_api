const Joi = require("joi");

const blog_validate_schema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string(),
  categoryList: Joi.array().min(1).required(),
  urlList: Joi.array(),
  status: Joi.string(),
});

module.exports = { blog_validate_schema };
