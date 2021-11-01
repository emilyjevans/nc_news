const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics ", () => {
  it("responds with an array of topic objects, each with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        const { body } = response;
        expect(body.topics).toBeInstanceOf(Array);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
    it("should respond with an article object, with the following properties: author, title, article_id, body, topic, created_at, votes, comment_count", () => {
        return request(app)
        .get("/api/articles/2")
        .then((response) => {
            const { body } = response;
            expect(body.article).toEqual(expect.objectContaining({
                author: 'icellusedkars',
                title: 'Eight pug gifs that remind me of mitch',
                article_id: 3,
                body: expect.any(String),
                topic: 'mitch',
                created_at: expect.any(Date),
                votes: 0,
                comment_count: 2
            }))
        })
    })
})

// Error handling
describe("ERRORS", ()=> {
    it("Status 404 invalid url", () => {
        return request(app)
        .get("/not_an_endpoint")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
        });
    })
    it("/api/topics endpoint - client uses POST which is not allowed", () => {
        return request(app)
        .post("/api/topics")
        .expect(405)
    })
    it("/api/topics endpoint - client uses PATCH which is not allowed", () => {
        return request(app)
        .patch("/api/topics")
        .expect(405)
    })
    it("/api/topics endpoint - client uses DELETE which is not allowed", () => {
        return request(app)
        .delete("/api/topics")
        .expect(405)
    })
})