const {
  selectArticle,
  increaseVotes,
  selectAllArticles,
  selectCommentsByArticle,
} = require("../models/articles.models.js");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((data) => res.status(200).send({ article: data }))
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  increaseVotes(article_id, inc_votes)
    .then((data) => res.status(200).send({ article: data }))
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic, author } = req.query;
  selectAllArticles(sort_by, order, topic, author)
    .then((data) => {
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
