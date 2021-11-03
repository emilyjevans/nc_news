// const db = require("../db/connection");

// exports.checkTopic = (inputTopic) => {
//     const queryStr = `SELECT slug FROM topics;`
    
//     return db.query(queryStr).then((topics)=>{
//         let topicArray = [];
//         for (topic of topics.rows){
//             topicArray.push(topic.slug)
//         }
//         if(!topics.includes(inputTopic)){
//             return Promise.reject({
//                 status: 404,
//                 msg: `No article found for article_id: ${article_id}`,
//               });
//         }
//     })
// }