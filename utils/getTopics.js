const db = require("../db/connection");

exports.getTopicsFromDatabase = (inputTopic) => {
    const queryStr = `SELECT slug FROM topics;`
    return db.query(queryStr).then((topics)=>{
        let topicArray = [];
        let topicsObj = topics.rows
        for (topic of topicsObj){
            topicArray.push(topic.slug)
        }
        return topicArray;
    })
}