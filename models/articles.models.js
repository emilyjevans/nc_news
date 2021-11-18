const db = require("../db/connection");
const { checkTopicsFromDatabase } = require("../utils/checkTopicsFromDatabase");
const { getTopicsFromDatabase } = require("../utils/checkTopicsFromDatabase");

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

exports.increaseVotes = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
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

exports.selectCommentsByArticle = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return rows;
    });
};

exports.insertComment = (article_id, username, body) => {
  if (!body) {
    return Promise.reject({
      status: 400,
      msg: `Bad request`,
    });
  }
  return db
    .query(
      `INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`,
      [body, username, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: `Bad request`,
        });
      }
      return rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT username from users;`).then(({ rows }) => {
    return rows;
  });
};
