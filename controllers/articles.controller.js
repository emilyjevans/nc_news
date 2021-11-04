const {
  selectArticle,
  increaseVotes,
  selectAllArticles,
  selectCommentsByArticle,
  insertComment,
  deleteComment,
} = require("../models/articles.models.js");

const { getTopicsFromDatabase } = require("../utils/getTopics");

const { checkTopics } = require("../utils/getTopics");

exports.getArticle = (req, res, next) => {
  console.log("in the controller");
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((data) => res.status(200).send({ article: data }))
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  increaseVotes(article_id, inc_votes)
    .then((data) => res.status(201).send({ article: data }))
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic, author } = req.query;
  selectAllArticles(sort_by, order, topic, author)
    .then((data) => {
      console.log(data);
      if (data.length === 0) {
        res.status(204);
      }
      res.status(200).send({ articles: data });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticle(article_id)
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch(next);
};

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
  console.log("in the controller")
  const { comment_id } = req.params;
  deleteComment(comment_id).then((data) => {
    res.status(204).send();
  })
  .catch(next)
};
