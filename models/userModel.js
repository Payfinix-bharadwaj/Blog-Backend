const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the name"],
    },
    username: {
      type: String,
      required: [true, "Please add the user name"],
      unique: [true, "Username already taken"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    bio: {
      type: String,
      default: function () {
        return `Hi, I'm ${this.name}! I'm a web developer with in-depth experience in UI/UX design.`;
      },
    },
    profileimage: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/myapp-cbe31.appspot.com/o/Avatar2.png?alt=media&token=0de8f265-809b-4593-a491-651902e7df05",
    },
    selected_topics: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
          topic: String,
          color: String,
          icon: String,
        },
      ],
      default: [],
    },
    posts: [
      {
        article: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
          required: true,
        },
        article_title: {
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
        article_topic: {
          type: String,
          required: true,
        },
        article_create: {
          type: String,
          required: true,
        },
      },
    ],
    followers: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: String,
          isfollowing: Boolean,
        },
      ],
      default: [],
    },
    following: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: String,
          isfollowing: Boolean,
        },
      ],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Add a new field to store the formatted date
    createdMonthYear: {
      type: String,
      default: function () {
        return this.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
