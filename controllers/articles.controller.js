const {
  selectArticle,
  increaseVotes,
  selectAllArticles
} = require("../models/articles.models.js");

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
  .then((data) =>
    res.status(201).send({ article: data })
  )
  .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by } = req.params;
  selectAllArticles(sort_by)
  .then((data) => {
    res.status(200).send({ articles: data })
  })
}