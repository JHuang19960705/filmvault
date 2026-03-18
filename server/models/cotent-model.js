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
    required: true
  },
  content: {
    type: String,
    required: true
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
  },
  content: {
    type: String,
    required: true,
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
