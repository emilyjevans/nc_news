const apiRouter = require("express").Router();
const { invalidMethod } = require("../controllers/errors.controller.js");
const { getTopics } = require("../controllers/topics.controller.js");

apiRouter.get("/topics", getTopics)
.post("/topics", invalidMethod)
.delete("/topics", invalidMethod)
.patch("/topics", invalidMethod);

module.exports = { apiRouter };
