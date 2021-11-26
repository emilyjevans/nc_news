const db = require("../db/connection");
const { checkTopicsFromDatabase } = require("../utils/checkTopicsFromDatabase");

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
  COUNT(*)::int AS comment_count FROM articles
  LEFT JOIN comments on articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.author, articles.title, articles.article_id, articles.body, articles.topic,
  articles.created_at, articles.votes;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return rows[0];
    });
};

exports.increaseVotes = (article_id, inc_votes = 0) => {
  return db
    .query(
      `UPDATE articles 
     SET 
     votes = votes + $1
     WHERE article_id = $2
     RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectAllArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic = null,
  author = null
) => {
  const sortByEntries = [
    "author",
    "title",
    "article_id",
    "body",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  const orderByEntries = ["asc", "desc"];

  if (!sortByEntries.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  if (!orderByEntries.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  let sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id)::Int AS comment_count
  from articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const queries = [];

  if (topic !== null && author !== null) {
    sqlQuery += ` WHERE topic = $1 AND author = $2`;
    queries.push(topic);
    queries.push(author);
  }
  if (topic !== null && author === null) {
    sqlQuery += ` WHERE topic = $1`;
    queries.push(topic);
  }
  if (author !== null && topic === null) {
    sqlQuery += ` WHERE articles.author = $1`;
    queries.push(author);
  }

  sqlQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  const { rows } = await db.query(sqlQuery, queries);

  if (!rows.length && topic) {
    await checkTopicsFromDatabase(topic);
  }
  return rows;
};

exports.selectCommentsByArticle = async (article_id) => {
  const article = await this.selectArticle(article_id);
  if (article.status === 404) return Promise.reject(article);

  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
