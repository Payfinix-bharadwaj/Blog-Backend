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

  const newTopics = topics.filter(topic => {
    // Check if the topic is already in the selected_topics array
    return !user.selected_topics.some(selectedTopic => selectedTopic._id.toString() === topic._id.toString());
  });

  // Add the new topics to the selected_topics array
  user.selected_topics = [
    ...user.selected_topics,
    ...newTopics.map((topic) => ({
      __v: 0,
      _id: topic._id,
      topic: topic.topic,
      value: topic.value,
      icon: topic.icon,
      color: topic.color,
    })),
  ];

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
      user.selected_topics.push({
        _id: newTopic._id,
        topic: newTopic.topic,
        value: newTopic.value,
        icon: newTopic.icon,
        color: newTopic.color, });
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
    .populate("username")
    .select("profileimage name ")

  if (!users) {
    response.status(404).json({
      message:"No users found with the selected topics"
    });
    // throw new Error();
  }

  const filteredUsers = users
  .filter((user) => user._id.toString() !== currentUser._id.toString())
  .map((user) => {
    const isFollowing = currentUser.following.some(
      (following) => following._id.toString() === user._id.toString()
    );
    return {
      ...user.toObject(),
      isfollowing: isFollowing,
    }; 
  });
  response.status(200).json(filteredUsers);
});

const getSelectedTopics = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user.id);
  if (!user) {
    response.status(404);
    throw new Error("User not found");
  }

  const selectedTopics = user.selected_topics.map((topic) => {
    return {
      id:topic.id,
      topic: topic.topic,
      icon: topic.icon,
      color: topic.color,
    };
  });

  response.status(200).json(selectedTopics);
});

module.exports = {
  chooseTopics,
  updateSelectedTopics,
  getUsersBySelectedTopics,
  getSelectedTopics,
};
