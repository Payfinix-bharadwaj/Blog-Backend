const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const followUnfollowUser = asyncHandler(async (request, response) => {
    const { userId } = request.body;
    const followerId = request.user.id;
  
    if (!userId) {
      response.status(400);
      throw new Error("Missing userId parameter");
    }
  
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);
  
    if (!user) {
      response.status(404);
      throw new Error("User not found");
    }
  
    if (!follower) {
      response.status(404);
      throw new Error("Follower not found");
    }
  
    if (request.method === "POST") {
      // Follow the user
  
      const followerUsername = request.user.username;
      const isAlreadyFollowed = user.followers.some(
        (follower) => follower._id.toString() === followerId.toString()
      );
  
      if (isAlreadyFollowed) {
        response.status(200).json({
          isfollowing: true,
          message: "You are already following this user",
        });
      } else {
        user.followers.push({
          _id: followerId,
          username: followerUsername,
        });
  
        if (
          !follower.following.some(
            (follow) => follow._id.toString() === userId.toString()
          )
        ) {
          follower.following.push({
            _id: userId,
            username: user.username,
          });
  
          await follower.save();
        }
  
        await user.save();
  
        response.status(200).json({
          isfollowing: true,
          message: "You have followed this user",
        });
      }
    } else if (request.method === "DELETE") {

      // Unfollow the user
      const isFollowing = follower.following.some(
        (follow) => follow._id.toString() === userId.toString()
      );
  
      if (isFollowing) {
        user.followers = user.followers.filter(
          (sub) => sub._id.toString() !== followerId.toString()
        );
  
        follower.following = follower.following.filter(
          (follow) => follow._id.toString() !== userId.toString()
        );
  
        await user.save();
        await follower.save();
  
        response.status(200).json({
          isfollowing: false,
          message: "You have unfollowed this user",
        });
      } else {
        response.status(400);
        throw new Error("You are not following this user");
      }
    } else {
      response.status(405);
      throw new Error("Method not allowed");
    }
  });
  
module.exports={
    followUnfollowUser,
}
  