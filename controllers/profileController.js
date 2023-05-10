const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Article = require("../models/articleModel");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const moment = require("moment");

const UserProfileView = asyncHandler(async (request, response) => {
  const userId = request.user.id;
  const user = await User.findById(userId).select(
    "profileimage username name posts following followers"
  );
  const profileimg = user.profileimage;
  const username = user.username;
  const name = user.name;
  const postscount = user.posts.length;
  const followerscount = user.followers.length;
  const followingcount = user.following.length;

  response.status(200).json({
    profileimg,
    username,
    name,
    postscount,
    followerscount,
    followingcount,
  });
});

const AuthorProfileView = asyncHandler(async (request, response) => {
  const userId = request.user.id;
});

const UpdateUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (updates.alter_email && updates.alter_email !== user.email) {
      const existingUser = await User.findOne({
        alter_email: updates.alter_email,
      });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: "Email address already taken" });
      }
    }
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });
    res.json(updatedUser);

    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const NavBarProfile = asyncHandler(async (request, response) => {
  try {
    let userId = request.user.id;

    if (request.body.userId) {
      userId = request.body.userId;
    } 

    const user = await User.findById(userId).select(
      "_id profileimage username name bio selected_topics createdMonthYear profile_tagline user_location posts followers following profile_tagline selected_topics"
    );

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const userid = user._id;
    const profileimage = user.profileimage;
    const username = user.username;
    const name = user.name;
    const postscount = user.posts.length;
    const followerscount = user.followers.length;
    const followingcount = user.following.length;
    const bio = user.bio;
    const profile_tagline = user.profile_tagline;
    const selected_topics = user.selected_topics;
    const createdMonthYear = user.createdMonthYear;
    const user_location = user.user_location;

    const currentUserId = request.user.id;
    const isCurrentUser = currentUserId.toString() === user._id.toString();
    const isfollowing = isCurrentUser
      ? false
      : user.followers.some(
          (follower) => follower._id.toString() === currentUserId.toString()
        );
    const currentuser = isCurrentUser;

    response.json({
      userid,
      isfollowing,
      currentuser,
      profileimage,
      username,
      name,
      postscount,
      followerscount,
      followingcount,
      bio,
      profile_tagline,
      selected_topics,
      createdMonthYear,
      user_location,
    });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Server error" });
  }
});

// const RecentActivity = asyncHandler(async (req, res) => {
//   try {
//     const articles = await Article.find({ user_id: req.user.id })
//       .select("article_title createdMonthYear article_sub user_id")
//       .sort({ createdAt: -1 });

//     const articlesByDate = moment(articles.createdMonthYear).format("MMM D");
//     console.log("articledate", articlesByDate);

//     const groupedArticles = _(articles)
//       .groupBy("createdMonthYear")
//       .map((articles, createdMonthYear) => ({
//         createdMonthYear,
//         // user_id: req.user.id, // Add user_id property here
//         data: articles.map(({ _id, article_title }) => ({
//           id: _id,
//           article_title,
//         })),
//       }))
//       .value();

//     res.status(200).json(groupedArticles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

const RecentActivity = asyncHandler(async (req, res) => {
  try {
    let userId = req.user.id;

    if (req.body.userId) {
      userId = req.body.userId;
    }

    const articles = await Article.find({ user_id: userId })
      .select("article_title createdMonthYear article_sub user_id")
      .sort({ createdAt: -1 });


    const groupedArticles = _(articles)
      .groupBy("createdMonthYear")
      .map((articles, createdMonthYear) => ({
        createdMonthYear,
        // user_id: userId,
        data: articles.map(({ _id, article_title }) => ({
          id: _id,
          article_title,
        })),
      }))
      .value();

    res.status(200).json(groupedArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = {
  AuthorProfileView,
  UserProfileView,
  NavBarProfile,
  UpdateUserProfile,
  RecentActivity,
};
