import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  comment: {
    type: String,
  },
  isOpen: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const BookSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    publicid: {
      type: String,
    },
    title: {
      type: String,
      require: true,
    },

    description: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
    expired: {
      type: Boolean,
      required: false,
      default: false,
    },

    count: {
      type: Number,
      default: 0,
    },
    borrow: {
      type: Boolean,
      required: false,
      default: false,
    },

    email: {
      type: String,
      unique: true,
    },

    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export const BookModel = mongoose.model("BookModel", BookSchema);
