const mongoose = require("mongoose");
const { postStatus } = require("../constants/status");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    urlList: {
      type: [String],
    },
    status: {
      type: String,
      default: postStatus.pending,
      enum: [postStatus.pending, postStatus.approved, postStatus.rejected],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
