const mongoose = require("mongoose");

const articleSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    article_title: {
      type: String,
      required: [true, "Please add the article title"],
    },
    article_sub: {
      type: String,
      required: [true, "Please add the article subtitle"],
    },
    article_doc: {
      type: String,
      required: [true, "Please add the article document"],
    },
    article_topic: {
      type: String,
      required: [true, "Please add the article topic"],
    },
    article_cover: {
      type: String,
      required: [true, "Please add the article cover"],
    },
    article_views:{
        type:Number,
        default:0
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", articleSchema);
