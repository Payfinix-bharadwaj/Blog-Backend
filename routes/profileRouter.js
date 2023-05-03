const express = require("express");

const { NavBarProfile,UserProfileView } = require("../controllers/profileController");

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.get("/", validateToken, NavBarProfile);

router.get("/user", validateToken, UserProfileView);


module.exports = router;
