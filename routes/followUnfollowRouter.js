const express = require("express");
const {followUnfollowUser} = require("../controllers/followUnfollowController")

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/", validateToken, followUnfollowUser);

router.delete("/", validateToken, followUnfollowUser);

module.exports = router;