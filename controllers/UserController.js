const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const regex = new RegExp(`^${searchTerm}`, 'i');

const registerUser = asyncHandler(async (request, response) => {
  const { name, username, email, password } = request.body;
  if (!username || !email || !password) {
    response.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    response.status(400);
    throw new Error("User already registered!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
    
  });

  console.log(`User created ${user}`);
  if (user) {
    response.status(200).json({
      message: "Registered Successfully!",
      _id: user.id,
      email: user.email,
      bio:user.bio,
    });
  } else {
    response.status(400);
    throw new Error("User data is not valid");
  }
  response.json({ message: "Register the user" });
});

const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    response.status(400);
    throw new Error("All fields are mandatory!");
  }

  let user;
  if (/^@/.test(email)) {
    user = await User.findOne({ username: email });
  } else if (email != /^@/.test(email)) {
    user = await User.findOne({ email });
  } else {
    response.status(401);
    throw new Error("Invalid username or password");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          name: user.name,
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "10080m" }
    );
    response.status(200).json({
      accessToken,
      message: "Login Successfully!",
    });
  } else {
    response.status(401);
    throw new Error("Invalid email or password");
  }
});

const currentUser = asyncHandler(async (request, response) => {
  response.json(request.user);
});

const followUser = asyncHandler(async (request, response) => {
  const { userId } = request.body;
  const followerId = request.user.id;
  const followerUsername = request.user.username;

  const user = await User.findById(userId);
  const follower = {
    _id: followerId,
    username: followerUsername,
    isfollowing: true, // set isfollowing status to true
  };

  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  user.followers.push(follower);

  const currentUser = await User.findById(followerId);
  const isAlreadyFollowing = currentUser.following.some(
    (following) => following._id.toString() === userId.toString()
  );

  if (!isAlreadyFollowing) {
    currentUser.following.push({
      _id: userId,
      username: user.username,
      isfollowing: true, // set isfollowing status to true
    });
    await currentUser.save();
  }

  await user.save();

  response.status(200).json({
    isfollowing: true,
    message: "You have followed this user",
  });
});

const unfollowUser = asyncHandler(async (request, response) => {
  const { userId } = request.body;
  const followerId = request.user.id;

  const user = await User.findById(userId);
  const follower = await User.findById(followerId);

  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  if (!follower) {
    response.status(404);
    throw new Error("follower not found");
  }

  // Remove the follower from the user's followers list
  user.followers.some(
    (sub) => sub._id.toString() === followerId.toString()
  )
 {
  user.followers = user.followers.filter(
    (sub) => sub._id.toString() !== followerId.toString()
  );
  await user.save();
}


  // Remove the user from the follower's following list
  follower.following.some(
    (follow) => follow._id.toString() === userId.toString()
  )
 {
  follower.following = follower.following.filter(
    (follow) => follow._id.toString() !== userId.toString()
  );
  await follower.save();
} 

  response.status(200).json({
    isfollowing: false,
    message: "You have unfollowed this user",
  });
});

const searchUsers = async (req, res) => {
  try {
    const { query } = req.body;

    // Check if the query is empty or contains only white spaces
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Query!",
      });
    }

    const currentUser = await User.findById(req.user.id).populate(
      "selected_topics"
    );
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        
      ],
    })
      .select("profileimage username name selected_topics")
      .exec();
    if (users.length === 0) {
      return res.status(404).json({
        message: "No authors found!",
      });
    } 

    const filteredUsers = users
      .filter((user) => user._id.toString() !== currentUser._id.toString())
      .map((user) => {
        const selectedTopics = user.selected_topics.map((topic) => topic.topic);
        const isFollowing = currentUser.following.some(
          (following) => following._id.toString() === user._id.toString()
        );
        return {
          ...user.toObject(),
          selected_topics: selectedTopics,
          isfollowing: isFollowing,
        };
      });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  followUser,
  unfollowUser,
  searchUsers,
};
