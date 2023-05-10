const express = require("express");

const {
  NavBarProfile,
  UserProfileView,
  UpdateUserProfile,
  RecentActivity,
} = require("../controllers/profileController");

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/", validateToken, NavBarProfile);

router.get("/user", validateToken, UserProfileView);

router.put("/update", validateToken, UpdateUserProfile);

router.post("/recent", validateToken, RecentActivity);

module.exports = router;
