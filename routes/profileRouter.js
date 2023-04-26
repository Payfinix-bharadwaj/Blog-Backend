const express = require("express");

const {NavBarProfile} = require("../controllers/profileController")

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.get("/", validateToken, NavBarProfile);

module.exports = router;
