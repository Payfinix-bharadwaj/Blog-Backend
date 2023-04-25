const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

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

  //compare password with hashedpassword
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

// const userFollower = asyncHandler(async (request,response) => {
//   const user1 = await User.findById('user1Id');
//   const user2 = await User.findById('user2Id');
//   await user1.subscribe(user2.id);
// })

const subscribeUser = asyncHandler(async (request, response) => {
  const { userId } = request.body;
  const subscriberId = request.user.id;
  const subscriberUsername = request.user.username;

  const user = await User.findById(userId);
  const subscriber = {
    _id: subscriberId,
    username: subscriberUsername,
  };

  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  const isAlreadySubscribed = user.subscribers.some(
    (subscriber) => subscriber._id.toString() === subscriberId.toString()
  );

  if (isAlreadySubscribed) {
    response.status(400);
    throw new Error("You are already subscribed to this user");
  }

  user.subscribers.push(subscriber);
  const currentUser = await User.findById(subscriberId);
  const isAlreadyFollowing = currentUser.following.some(
    (following) => following._id.toString() === userId.toString()
  );

  if (!isAlreadyFollowing) {
    currentUser.following.push({
      _id: userId,
      username: user.username,
    });
    await currentUser.save();
  }

  await user.save();

  response.status(200).json({
    success: true,
    message: "You have subscribed to this user",
  });
});

const unsubscribeUser = asyncHandler(async (request, response) => {
  const { userId } = request.body;
  const subscriberId = request.user.id;

  const user = await User.findById(userId);
  const subscriber = await User.findById(subscriberId);

  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  if (!subscriber) {
    response.status(404);
    throw new Error("Subscriber not found");
  }

  // Remove the subscriber from the user's subscribers list
  if (
    user.subscribers.some(
      (sub) => sub._id.toString() === subscriberId.toString()
    )
  ) {
    user.subscribers = user.subscribers.filter(
      (sub) => sub._id.toString() !== subscriberId.toString()
    );
    await user.save();
  } else {
    response.status(400);
    throw new Error("You are not subscribed to this user");
  }

  // Remove the user from the subscriber's following list
  if (
    subscriber.following.some(
      (follow) => follow._id.toString() === userId.toString()
    )
  ) {
    subscriber.following = subscriber.following.filter(
      (follow) => follow._id.toString() !== userId.toString()
    );
    await subscriber.save();
  } else {
    response.status(400);
    throw new Error("You are not following this user");
  }

  response.status(200).json({
    success: true,
    message: "You have unsubscribed from this user",
  });
});

const profile = asyncHandler(async (request, response) => {
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
  registerUser,
  loginUser,
  currentUser,
  subscribeUser,
  unsubscribeUser,
  profile
};
