const express = require("express");

const router = express.Router();

const {
  createArticle,
  GetArticle,
  getArticles,
  UpdateArticle,
  DeleteArticle,
  getLatestArticleCards,
  clapArticle,
  unClapArticle,
  // updateArticleViews,
  SearchArticles,
  BookmarkArticle,
  UnBookmarkArticle,
  GetUserBookmarks,
  SearchBookMarkedArticles,
} = require("../controllers/articleController");

const validateToken = require("../middleware/validateTokenHandler");

// const { UserProfileView } = require("../controllers/profileController");

router.route("/create").post(validateToken, createArticle);

router.route("/get").get(getArticles);

router.route("/getlatest").get(validateToken, getLatestArticleCards);

router.route("/:id").get(GetArticle).put(UpdateArticle).delete(DeleteArticle);

router.route("/clap").post(validateToken, clapArticle);

router.route("/unclap").post(validateToken, unClapArticle);

router.route("/views").post(validateToken, clapArticle);

router.route("/search").post(validateToken, SearchArticles);

router.route("/bookmark").post(validateToken, BookmarkArticle);

router.route("/unbookmark").post(validateToken, UnBookmarkArticle);

router.route("/getbook").post(validateToken, GetUserBookmarks);

router.route("/searchbook").post(validateToken, SearchBookMarkedArticles);

module.exports = router;
