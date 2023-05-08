const express = require("express");

const { NavBarProfile,UserProfileView,UpdateUserProfile } = require("../controllers/profileController");

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.get("/", validateToken, NavBarProfile);

router.get("/user", validateToken, UserProfileView);

router.put("/update", validateToken, UpdateUserProfile);

module.exports = router;
