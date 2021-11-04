const db = require("../db/connection");

exports.checkTopicsFromDatabase = async (inputTopic) => {
    const queryStr = `SELECT * FROM topics WHERE slug = $1`
    const {rows} = await db.query(queryStr, [inputTopic])

    if (rows.length === 0){
        return Promise.reject({
            status: 404,
            msg: "Not found",
          });
    }
}
