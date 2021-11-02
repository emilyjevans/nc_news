const db = require("../db/connection");

//Need to add in template literal here //
exports.selectArticle = (article_id) => {
  return db
    .query(
      `SELECT articles.author, 
  articles.title,
  articles.article_id,
  articles.body,
  articles.topic,
  articles.created_at,
  articles.votes,
  COUNT(*) AS comment_count FROM articles
  LEFT JOIN comments on articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.author, articles.title, articles.article_id, articles.body, articles.topic,
  articles.created_at, articles.votes;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        console.log("rows");
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return rows[0];
    });
};

exports.increaseVotes = (article_id, inc_votes) => {
  console.log("in the model");
  if (!inc_votes){
    return Promise.reject({
      status: 400,
      msg: 'Bad request'
    })
  }
  return db.query(
    `UPDATE articles 
     SET 
     votes = votes + $1
     WHERE article_id = $2
     RETURNING *`, [inc_votes, article_id]
  ).then(({ rows }) => {
    return rows[0]
  });
};

exports.selectAllArticles = (sort_by = 'created_at') => {
  console.log("in the model")
  return db.query(
    `SELECT * FROM articles 
    ORDER BY $1`, [sort_by]
  ).then(({rows}) => {
    return rows;
  })
}
