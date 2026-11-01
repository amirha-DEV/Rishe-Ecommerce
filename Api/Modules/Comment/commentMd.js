import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "محصول الزامی است"],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "کاربر الزامی است"],
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    isBought: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: [1, "امتیاز حداقل باید 1 باشد"],
      max: [5, "امتیاز حداکثر باید 5 باشد"],
      validate: {
        validator: Number.isInteger,
        message: "امتیاز باید عدد صحیح باشد",
      },
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

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
