const asyncHandler = require("express-async-handler");

const Topic = require("../models/topicMainModel");

const CreateTopics = asyncHandler(async (request, response) => {
  console.log("The request body is:", request.body);
  const { topics } = request.body;
  if (!Array.isArray(topics) || topics.length === 0) {
    return response.status(400).json({ message: "Invalid request body" });
  }
  try {
    const result = await Topic.insertMany(topics);
    response.json({
      message: `${result.length} topics created successfully`,
      createdTopics: result,
    });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Error creating topics" });
  }
});

const GetTopics = asyncHandler(async (request, response) => {
  const topic = await Topic.find({});
  response.status(200).json(topic);
});

const getTopic = asyncHandler(async (request, response) => {
  const topic = await Topic.findById(request.params.id);
  response.status(200).json(topic);
});

const addTopic = asyncHandler(async (request, response) => {
  console.log("The request body is:", request.body);
  const { topic, icon, value, color } = request.body;
  if (!topic || !icon || !value || !color) {
    return response.status(400).json({ message: "Invalid request body" });
  }

  const topicAvailable = await Topic.findOne({ topic });
  if (topicAvailable) {
    response.status(400);
    throw new Error("Topic already created!");
  }

  try {
    const result = await Topic.create({
      topic,
      icon,
      value,
      color,
    });
    response.json({
      message: `Topic created successfully`,
      createdTopic: result,
    });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Error creating topic" });
  }
});

module.exports = { CreateTopics, GetTopics, getTopic, addTopic };
