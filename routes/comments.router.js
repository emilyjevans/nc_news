const { removeComment } = require("../controllers/comments.controller.js");
const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(removeComment);

module.exports = commentsRouter;
