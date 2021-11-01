const db = require("../connection");
//const format = require("pg-format")

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables

  async function deleteExistingTables() {
    const deleteTables = await Promise.all([
      db.query(`DROP TABLE IF EXISTS article_data`),
      db.query(`DROP TABLE IF EXISTS comment_data`),
      db.query(`DROP TABLE IF EXISTS topic_data`),
      db.query(`DROP TABLE IF EXISTS user_data`),
    ]);
  }

  // create topic data

  async function createTables() {
    return db.query(`CREATE TABLE topic_data (
    slug SERIAL PRIMARY KEY,
    description VARCHAR
    );`);
  }

  // // create article data table
  // db.query(`CREATE TABLE article_data (
  //   article_id SERIAL PRIMARY KEY,
  //   title VARCHAR,
  //   body TEXT,
  //   votes defaults to 0
  //   topic VARCHAR REFERENCES topics(slug)
  //   author field that references a user's primary key (username)
  //   created_at defaults to the current timestamp
  // )`);

  return deleteExistingTables().then(() => {
    return createTables();
  });

  // 2. insert data
};

//seed(data)
module.exports = seed;
