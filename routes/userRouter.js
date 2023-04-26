const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  followUser,
  unfollowUser,
  searchUsers,
} = require("../controllers/UserController");

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.post("/follow", validateToken, followUser);

router.post("/unfollow", validateToken, unfollowUser);

router.post("/search", validateToken, searchUsers);

module.exports = router;
