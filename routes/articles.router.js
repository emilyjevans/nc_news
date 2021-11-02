const { getArticle } = require("../controllers/articles.controller");
const articlesRouter = require("express").Router();

articlesRouter
.route("/:article_id")
.get(getArticle);

module.exports = { articlesRouter };