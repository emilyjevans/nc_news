const db = require("../db/connection");
const { getTopicsFromDatabase } = require("../utils/getTopics");

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
  console.log("in the model");
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

exports.selectAllArticles = (
  sort_by = "created_at",
  order = "desc",
  topic = null,
  author = null
) => {
  console.log("in the model");

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

  // Check topic exists in database

  // async function checkTopic() {
  //   const topics = await getTopicsFromDatabase()
  //   return topics;
  // }

  // const topics = await checkTopic();

  // console.log(topics) /// ??

  // if(!topics.includes(topic)){
  //   return Promise.reject({
  //     status: 204,
  //     msg: "No content",
  //   });
  // }

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

  let sqlQuery = `SELECT * FROM articles`;
  const queries = [sort_by, order];

  if (topic !== null && author !== null) {
    sqlQuery += ` WHERE topic = $3 AND author = $4`;
    queries.push(author);
  }
  if (topic !== null && author === null) {
    sqlQuery += ` WHERE topic = $3`;
    queries.push(topic);
  }
  if (author !== null && topic === null) {
    sqlQuery += ` WHERE author = $3`;
    queries.push(author);
  }

  sqlQuery += ` ORDER BY $1, $2`;

  return db.query(sqlQuery, queries).then(({ rows }) => {
    return rows;
  });
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
      msg: `Blank comments are not accepted`,
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
