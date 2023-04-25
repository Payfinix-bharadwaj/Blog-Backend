const express = require("express");

const router = express.Router();

const {
  createArticle,
  GetArticle,
  getArticles,
  UpdateArticle,
  DeleteArticle,
} = require("../controllers/articleController");

const validateToken = require("../middleware/validateTokenHandler");

router.route("/create").post(validateToken, createArticle);

router.route("/get").get(getArticles);

router.route("/:id").get(GetArticle).put(UpdateArticle).delete(DeleteArticle);

module.exports = router;
