const { selectTopics } = require("../models/topics.models")

exports.getTopics = (req, res) => {
    return selectTopics().then((body) => {
        res.status(200).send({topics: body})
    })
}