const asyncHandler = require("express-async-handler");
const Article = require("../models/articleModel");
const User = require("../models/userModel")


const getArticles = asyncHandler(async (request, response) => {
  const article = await Article.find();
  response.status(200).json(article);
});

const createArticle = asyncHandler(async (request, response) => {
  console.log("The request body is :", request.body);
  const {
    article_title,
    article_doc,
    article_topic,
    article_sub,
    article_cover,
    article_views,
  } = request.body;
  if (
    !article_title ||
    !article_doc ||
    !article_topic ||
    !article_cover ||
    !article_sub
  ) {
    response.status(400);
    throw new Error("All fields are mandatory !");
  }
  const article = await Article.create({
    article_title,
    article_doc,
    article_topic,
    article_sub,
    article_cover,
    article_views,
    user_id: request.user.id,
  });

  const user = await User.findByIdAndUpdate(
    request.user.id,
    { $push: { post: { _id: article._id, article_title: article.article_title } } },
    { new: true } 
  );

  response.status(200).json(article);
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
    .json({ article, message: `Get Article for ${request.params.id}` });
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
    .json({ message: `Update Article for ${request.params.id}` });
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
    .json({ message: `Delete Article for ${request.params.id}` });
});

module.exports = {
  createArticle,
  GetArticle,
  getArticles,
  UpdateArticle,
  DeleteArticle,
};
