const apiRouter = require("express").Router();
const { getArticle } = require("../controllers/articles.controller.js")
const { invalidMethod } = require("../controllers/errors.controller.js");
const { getTopics } = require("../controllers/topics.controller.js");

apiRouter.get("/topics", getTopics)
.post("/topics", invalidMethod)
.delete("/topics", invalidMethod)
.patch("/topics", invalidMethod);

apiRouter.get("/articles/:article_id", getArticle)

module.exports = { apiRouter };
