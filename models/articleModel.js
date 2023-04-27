const mongoose = require("mongoose");
const moment = require("moment");

const articleSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    user_name: {
      type: String,
      required: true,
    },
    user_image: {
      type: String,
      required: true,
    },
    article_title: {
      type: String,
      required: true,
    },
    article_desc: {
      type: String,
      required: true,
    },
    article_topic: {
      type: String,
      required: true,
    },
    article_sub: {
      type: String,
      required: false,
    },
    article_image: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function (createdAt) {
        return moment(createdAt).fromNow();
      },
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);


module.exports = mongoose.model("Article", articleSchema);
