const db = require("../connection");
//const format = require("pg-format")

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables

  async function deleteExistingTables() {
    await db.query(`DROP TABLE IF EXISTS comments`);
    await db.query(`DROP TABLE IF EXISTS articles`);
    await db.query(`DROP TABLE IF EXISTS topics`);
    await db.query(`DROP TABLE IF EXISTS users`);
  }
  // create topic data

  async function createTopicTable() {
    return db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
    );`);
  }

  // create user table
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
    body TEXT,
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
    body TEXT
  );`);
  }

  async function createTables(){
    await createTopicTable();
    await createUserTable();
    await createArticleTable();
    await createCommentTable();
  }

  return deleteExistingTables().then(() => {
    return createTables();
  })

  // 2. insert data
};

module.exports = seed;
