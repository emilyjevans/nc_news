const { selectArticle } = require("../models/articles.models.js")

exports.getArticle = (req, res, next) => {
  console.log("in the controller");
  const { article_id } = req.params;
  return selectArticle(article_id)
  .then((data) => res.status(200).send({ article: data }))
  .catch(next);
};
