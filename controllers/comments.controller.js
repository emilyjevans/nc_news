const {
  insertComment,
  deleteComment,
} = require("../models/comments.models.js");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertComment(article_id, username, body)
    .then((data) => {
      res.status(201).send({ comment: data });
    })
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then((data) => {
      res.status(204).send();
    })
    .catch(next);
};
