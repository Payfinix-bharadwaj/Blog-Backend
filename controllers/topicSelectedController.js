const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const chooseTopics = asyncHandler(async (request, response) => {
  const { topics } = request.body;

  const userId = request.user.id;

  const user = await User.findById(userId);

  if (!user) {
    response.status(400);
    throw new Error("User not found");
  }

  if (user && user.selected_topics) {
    // If selected_topics already exists, concatenate the new topics with the existing ones
    user.selected_topics = [
      ...user.selected_topics,
      ...topics.map((topic) => ({
        __v: 0,
        _id: topic._id,
        topic: topic.topic,
        value: topic.value,
        icon: topic.icon,
        color: topic.color,
      })),
    ];
  } else {
    // If selected_topics is null or undefined, set it to the new topics array
    user.selected_topics = topics.map((topic) => ({
      __v: 0,
      _id: topic._id,
      topic: topic.topic,
      value: topic.value,
      icon: topic.icon,
      color: topic.color,
    }));
  }

  await user.save();

  response.status(200).json({
    success: true,
    message: "Selected topics added successfully",
  });
});

const updateSelectedTopics = asyncHandler(async (request, response) => {
  const { topics } = request.body;
  const userId = request.user.id;

  const user = await User.findById(userId);

  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  topics.forEach((newTopic) => {
    const existingTopicIndex = user.selected_topics.findIndex(
      (t) => t._id.toString() === newTopic._id.toString()
    );

    if (existingTopicIndex > -1) {
      // Update the value of the existing topic
      user.selected_topics[existingTopicIndex].topic = newTopic.topic;
    } else {
      // Add the new topic to the array
      user.selected_topics.push({ _id: newTopic._id, topic: newTopic.topic });
    }
  });

  await user.save();

  response.status(200).json({
    success: true,
    message: "Selected topics added successfully",
  });
});



const getUsersBySelectedTopics = asyncHandler(async (request, response) => {

  const currentUser = await User.findById(request.user.id).populate("selected_topics");

  const users = await User.find({ selected_topics: { $in: currentUser.selected_topics } })
    .populate("selected_topics", "username")
    .select({
      password: 0,
      email: 0,
      username: 0,
      __v: 0,
      updatedAt: 0,
      createdAt: 0,
      subscribers: 0,
      following:0,
      post: 0,
      selected_topics: 0,
    });

  if (!users) {
    response.status(404).json({
      message:"No users found with the selected topics"
    });
    // throw new Error();
  }

  const filteredUsers = users.filter(user => user._id.toString() !== currentUser._id.toString());
  response.status(200).json(filteredUsers);
});

module.exports = {
  chooseTopics,
  updateSelectedTopics,
  getUsersBySelectedTopics,
};
