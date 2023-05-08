const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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

const AuthorProfileView = asyncHandler(async (request, response) => {});

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
    const userId = request.user.id;

    const user = await User.findById(userId).select(
      " _id profileimage username name bio selected_topics createdMonthYear profile_tagline user_location posts followers following profile_tagline selected_topics"
    );
    const id = user._id;
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

    const isfollowing = user.following.some(
      (following) => following._id.toString() === user._id.toString()
    );
    const currentuser = user.toString() === request.user.id.toString();

    response.json({
      id,
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

module.exports = {
  AuthorProfileView,
  UserProfileView,
  NavBarProfile,
  UpdateUserProfile,
};
