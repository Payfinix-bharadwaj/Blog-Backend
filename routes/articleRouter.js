const express = require("express");

const router = express.Router();

const {
  createArticle,
  GetArticle,
  getArticles,
  UpdateArticle,
  DeleteArticle,
  getLatestArticleCards
} = require("../controllers/articleController");

const validateToken = require("../middleware/validateTokenHandler");

router.route("/create").post(validateToken, createArticle);

router.route("/get").get(getArticles);

router.route("/getlatest").get(validateToken,getLatestArticleCards);

router.route("/:id").get(GetArticle).put(UpdateArticle).delete(DeleteArticle);

module.exports = router;
