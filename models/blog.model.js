const mongoose = require("mongoose");
const { Schema } = require("./base.schema");
const { blogStatus } = require("../constants/enum");
const { required } = require("joi");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    mainTitle: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    categoryList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    urlList: {
      type: [String],
    },
    status: {
      type: String,
      default: blogStatus.PENDING,
      enum: [blogStatus.PENDING, blogStatus.APPROVED, blogStatus.REJECTED],
    },
  },
  "User",
  undefined
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
