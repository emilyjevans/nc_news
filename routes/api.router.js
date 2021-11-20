const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/articles.controller.js");

const { invalidMethod } = require("../controllers/errors.controller.js");
const topicsRouter = require("../routes/topics.router");
const articlesRouter = require("../routes/articles.router");
const commentsRouter = require("../routes/comments.router");
const usersRouter = require("../routes/users.router");
const endpointsFile = require("../endpoints.json");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter
  .route("/")
  .get((req, res) => res.send({ endpoints: endpointsFile }))
  .all(invalidMethod);

module.exports = { apiRouter };
