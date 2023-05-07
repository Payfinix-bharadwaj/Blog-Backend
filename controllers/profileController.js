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
      "profileimage username name bio selected_topics createdMonthYear"
    );
    response.json(user);
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
