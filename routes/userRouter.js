const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  subscribeUser,
  unsubscribeUser,
  profile,
  searchUsers,
} = require("../controllers/UserController");

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.post("/sub", validateToken, subscribeUser);

router.post("/unsub", validateToken, unsubscribeUser);

router.get("/profile", validateToken, profile);

router.get("/search", validateToken, searchUsers);

module.exports = router;
