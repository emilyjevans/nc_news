const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables

  async function deleteExistingTables() {
    await db.query(`DROP TABLE IF EXISTS comments`);
    await db.query(`DROP TABLE IF EXISTS articles`);
    await db.query(`DROP TABLE IF EXISTS topics`);
    await db.query(`DROP TABLE IF EXISTS users`);
  }

  async function createTopicTable() {
    return db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
    );`);
  }

  async function createUserTable() {
    return db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    avatar_url TEXT,
    name VARCHAR
    );`);
  }

  async function createArticleTable() {
    return db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    body VARCHAR,
    votes INT DEFAULT 0, 
    topic VARCHAR REFERENCES topics(slug),
    author VARCHAR REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  }

  async function createCommentTable() {
    return db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR REFERENCES users(username), 
    article_id INT REFERENCES articles(article_id),
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body VARCHAR
  );`);
  }

  // 2. insert data

  async function insertTopicData() {
    const queryStr = format(
      `INSERT INTO topics
    (slug, description)
    VALUES
    %L 
    RETURNING *;`,
      topicData.map((topic) => [topic.slug, topic.description])
    );
    return db.query(queryStr);
  }

  async function insertUserData() {
    const queryStr = format(
      `INSERT INTO users
    (username, name, avatar_url)
    VALUES
    %L 
    RETURNING *;`,
      userData.map((user) => [user.username, user.name, user.avatar_url])
    );
    return db.query(queryStr);
  }

  async function insertArticleData() {
    const queryStr = format(
      `INSERT INTO articles
    (title, topic, author, body, created_at, votes)
    VALUES
    %L 
    RETURNING *;`,
      articleData.map((article) => [
        article.title,
        article.topic,
        article.author,
        article.body,
        article.created_at,
        article.votes,
      ])
    );
    return db.query(queryStr);
  }

  async function insertCommentData() {
    const queryStr = format(
      `INSERT INTO comments
    (body, votes, author, article_id, created_at)
    VALUES
    %L 
    RETURNING *;`,
      commentData.map((comment) => [
        comment.body,
        comment.votes,
        comment.author,
        comment.article_id,
        comment.created_at,
      ])
    );
    return db.query(queryStr);
  }

  async function createTables() {
    await createTopicTable();
    await createUserTable();
    await createArticleTable();
    await createCommentTable();
  }

  async function insertData() {
    await insertTopicData();
    await insertUserData();
    await insertArticleData();
    await insertCommentData();
  }

  // Run the async functions we have written  
  return deleteExistingTables().then(() => {
    return createTables().then(() => {
      return insertData();
    });
  });
  
};

module.exports = seed ;
