import mongoose from "mongoose";

const blogCommentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "مقاله الزامی است"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "کاربر الزامی است"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogComment",
      default: null,
    },
    content: {
      type: String,
      required: [true, "محتوا اجباری است"],
      trim: true,
      minlength: [3, "محتوا حداقل باید 3 کاراکتر باشد"],
      maxlength: [2000, "محتوا حداکثر باید 2000 کاراکتر باشد"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const BlogComment = mongoose.model("BlogComment", blogCommentSchema);
export default BlogComment;
