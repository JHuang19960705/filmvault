const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  commenterId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [500, "留言不能超過 500 個字"],
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const contentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [100, "標題不能超過 100 個字"],
  },
  content: {
    type: String,
    required: true,
    maxlength: [5000, "影評內容不能超過 5000 個字"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  commenters: [commentSchema],
  tags: {
    type: [String],
    default: [],
  },
  TMDBId: {
    type: String,
  },
  TMDBImg: {
    type: String,
  },
  like: {
    type: [String],
    default: [],
  }
});

module.exports = mongoose.model("Content", contentSchema);
