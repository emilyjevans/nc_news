const apiRouter = require("express").Router();
const {
  getAllArticles,
  getArticle,
  patchArticle,
  getCommentsByArticle,
  postComment,
} = require("../controllers/articles.controller.js");
const { invalidMethod } = require("../controllers/errors.controller.js");
const { getTopics } = require("../controllers/topics.controller.js");

apiRouter.route("/topics").get(getTopics).all(invalidMethod);

apiRouter.get("/articles", getAllArticles);

apiRouter
  .route("/articles/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(invalidMethod);

apiRouter
  .route("/articles/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment)
  .all(invalidMethod);

module.exports = { apiRouter };
