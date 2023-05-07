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
    article_clap: {
      type: Number,
      default: 0,
      //   get: function (value) {
      //     const abbreviations = ['', 'K', 'M', 'B', 'T'];
      //     const magnitude = Math.floor(Math.log10(value) / 3);
      //     const abbreviation = abbreviations[magnitude];
      //     const scaledValue = value / Math.pow(10, magnitude * 3);
      //     const roundedValue = Math.round(scaledValue * 10) / 10;
      //     return `${roundedValue}${abbreviation}`;
      // },
    },
    clappedBy: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isclapped: Boolean,
      },
    ],
    article_views: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    article_views_count: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      get: function (createdAt) {
        return moment(createdAt).fromNow();
      },
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      get: function (updatedAt) {
        return moment(updatedAt).fromNow();
      },
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

module.exports = mongoose.model("Article", articleSchema);
