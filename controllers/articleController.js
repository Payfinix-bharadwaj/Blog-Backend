const asyncHandler = require("express-async-handler");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const Topic = require("../models/topicMainModel");

const getArticles = asyncHandler(async (request, response) => {
  const article = await Article.find();
  response.status(200).json(article);
});

const createArticle = asyncHandler(async (request, response) => {
  console.log("The request body is :", request.body);
  const {
    article_title,
    article_desc,
    article_topic,
    article_sub,
    article_image,
  } = request.body;
  if (!article_topic || !article_title || !article_desc) {
    response.status(400);
    throw new Error("All fields are mandatory !");
  }

  const user = await User.findById(request.user.id);

  const topic = await Topic.findOne({ topic: article_topic[1] });

  const article = new Article({
    user_id: request.user.id,
    article_title,
    article_desc,
    article_topic: article_topic[1],
    article_sub,
    article_image,
  });
  console.log("article", article);

  const post = {
    article: article._id,
    article_title: article.article_title,
    article_sub: article.article_sub,
    article_image: article.article_image,
    article_topic: article_topic[1],
    article_create: article.createdMonthYear,
  };
  user.posts.push(post);

  console.log("post", post);

  if (!user.selected_topics.find((t) => t._id.equals(topic._id))) {
    user.selected_topics.push({
      _id: topic._id,
      topic: topic.topic,
      color: topic.color,
      icon: topic.icon,
    });
  }

  await Promise.all([user.save(), article.save()]);

  response
    .status(200)
    .json({ status: true, message: "Article created successfully!" });
});

const GetArticle = asyncHandler(async (request, response) => {
  const article = await Article.findById(request.params.id);
  if (!article) {
    response.status(404);
    throw new Error("Article not found");
  }
  response.status(200).json(article);
  response
    .status(200)
    .json({ article, message: `Got Article for ${request.params.id}` });
});

const UpdateArticle = asyncHandler(async (request, response) => {
  console.log("The request body:", request.body);
  const { user_id } = request.body;
  if (!user_id) {
    response.status(400);
    throw new Error("Article Id are Mandatory!");
  }
  response
    .status(200)
    .json({ message: `Updated Article for ${request.params.id}` });
});

const DeleteArticle = asyncHandler(async (request, response) => {
  console.log("The request body:", request.body);
  const { user_id } = request.body;
  if (!user_id) {
    response.status(400);
    throw new Error("Article Id are Mandatory!");
  }
  response
    .status(200)
    .json({ message: `Deleted Article for ${request.params.id}` });
});

const getLatestArticleCards = asyncHandler(async (req, res) => {
  try {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const user = await User.find({
      createdAt: { $gte: oneDayAgo },
    })
      .populate("posts")
      .sort({ createdAt: -1 })
      .select(
        "name profileimage article_title article_sub article_image article_create"
      );

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  createArticle,
  GetArticle,
  getArticles,
  UpdateArticle,
  DeleteArticle,
  getLatestArticleCards,
};
