const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  subscribeUser,
  unsubscribeUser,
} = require("../controllers/UserController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.post("/sub", validateToken, subscribeUser);

router.post("/unsub", validateToken, unsubscribeUser);

module.exports = router;
