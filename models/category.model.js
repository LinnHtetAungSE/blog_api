const mongoose = require("mongoose");
const { Schema } = require("./base.schema");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
  },
  "User",
  undefined
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
