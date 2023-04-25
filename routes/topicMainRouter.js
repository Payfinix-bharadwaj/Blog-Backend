const express = require("express");

const router = express.Router();

const {
  CreateTopics,
  getTopic,
  GetTopics,
  addTopic,
} = require("../controllers/topicMainController");

router.route("/create").post(CreateTopics);
router.route("/get").get(GetTopics);
router.route("/:id").get(getTopic);
router.route("/add").post(addTopic);

module.exports = router;
