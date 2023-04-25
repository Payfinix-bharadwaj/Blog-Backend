const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
});

module.exports = mongoose.model("Topic", topicSchema);
