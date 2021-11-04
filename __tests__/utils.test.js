const db = require("../db/connection.js");
// const { checkTopic } = require("../utils/checkTopic.js")

const { getTopicsFromDatabase } = require("../utils/getTopics")

afterAll(() => db.end());

describe("getTopicsFromDatabase", () => {
    it("returns current list of topics from topics table", () => {
        getTopicsFromDatabase().then((topics) => expect(topics).toEqual(['mitch', 'cats', 'paper']))
    })
})