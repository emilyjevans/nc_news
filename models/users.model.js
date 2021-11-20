const db = require("../db/connection");

exports.selectUsers = () => {
    return db.query(`SELECT username from users;`).then(({ rows }) => {
      return rows;
    });
  };
  