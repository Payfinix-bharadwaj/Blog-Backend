const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    article_title: {
      type: String,
      required: true
    },
    article_desc: {
      type: String,
      required: true
    },
    article_topic: {
      type:String,
      required:true
    },
    article_sub: {
      type: String,
      required: false
    },
    article_image: {
      type: String,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdMonthYear: {
      type: String,
      default: function() {
        return this.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day:'numeric' });
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Article", articleSchema);
