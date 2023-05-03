const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")

const UserProfileView = asyncHandler(async (request,response) => {
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
      followingcount
    });

});

const AuthorProfileView = asyncHandler(async (request,response) => {

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
  };
