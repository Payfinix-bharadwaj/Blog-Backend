const express = require("express");

const router = express.Router();

const {
  chooseTopics,
  updateSelectedTopics,
  getUsersBySelectedTopics,
} = require("../controllers/topicSelectedController");

const validateToken = require("../middleware/validateTokenHandler");

// router.use(validateToken);

router.post("/", validateToken, chooseTopics);
// router.route("/").post(chooseTopics);

router.route("/update").post(updateSelectedTopics);

router.get("/getuser", validateToken,getUsersBySelectedTopics);
// router.route("/getuser").get(getUsersBySelectedTopics);

module.exports = router;
