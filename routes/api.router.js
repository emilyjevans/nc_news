const apiRouter = require("express").Router();
const {
  getAllArticles,
  getArticle,
  patchArticle,
  getCommentsByArticle,
  postComment,
  removeComment,
  getEndpoints,
  getUsers
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

apiRouter.route("/comments/:comment_id").delete(removeComment);

apiRouter.route("/users").get(getUsers).all(invalidMethod)

apiRouter.route("/").get(getEndpoints).all(invalidMethod)

module.exports = { apiRouter };
