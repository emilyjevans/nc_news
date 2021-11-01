const { getArticle } = require("../controllers/articles.controller");
const articlesRouter = require("express").Router();

articlesRouter.get("/:article_id", getArticle);

module.exports = { articlesRouter };