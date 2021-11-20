const articlesRouter = require("express").Router();
const { invalidMethod } = require("../controllers/errors.controller.js");
const {
  getAllArticles,
  getArticle,
  patchArticle,
  getCommentsByArticle,
} = require("../controllers/articles.controller.js");
const { postComment } = require("../controllers/comments.controller.js");

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(invalidMethod);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment)
  .all(invalidMethod);

module.exports = articlesRouter;
