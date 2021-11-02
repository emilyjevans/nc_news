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

// Error handling
describe("ERRORS", () => {
  it("Status 404 invalid url", () => {
    return request(app)
      .get("/not_an_endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  it("/api/topics endpoint - client uses POST which is not allowed", () => {
    return request(app).post("/api/topics").expect(405);
  });
  it("/api/topics endpoint - client uses PATCH which is not allowed", () => {
    return request(app).patch("/api/topics").expect(405);
  });
  it("/api/topics endpoint - client uses DELETE which is not allowed", () => {
    return request(app).delete("/api/topics").expect(405);
  });
});

describe("GET /api/articles/:article_id", () => {
  it("should respond with an article object, with the following properties: author, title, article_id, body, topic, created_at, votes, comment_count", () => {
    return request(app)
      .get("/api/articles/3")
      .then((response) => {
        const { body } = response;
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            body: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: 0,
            comment_count: "2",
          })
        );
      });
  });
});

// Error handling //

describe("GET /api/articles/:article_id ERRORS", () => {
  it("returns a status 400 and bad request for a bad article_id", () => {
    return request(app)
      .get("/api/articles/not_an_article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  it("returns a status 404 and not found for a well formed article_id that doesn't exist in the database", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article_id: 999999");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("accepts an object in the form { inc_votes: newVote } and responds with the updated article, with the new number of votes", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 5 })
      .expect(201)
      .then((response) => {
        const { body } = response;
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            body: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: 5,
          })
        );
      });
  });
});

// Error handling

describe("ERRORS - PATCH /api/articles/:article_id", () => {
  it("no inc_votes included on request body, returns status 400 Bad Request", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ not_the_right_thing: "pasta" })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("invalid inc_votes eg. { inc_votes : 'cat' }, returns 400 Bad Request", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "cat" })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Bad request");
      });
  }); // Logic already covers this PSQL error
  it("there's an additional property on the request body, ignores additional property and completes with inc_votes", () => {
    return request(app)
    .patch("/api/articles/3")
    .send({ inc_votes: 5, name: 'Mitch' })
    .expect(201)
    .then((response) => {
      const { body } = response;
      expect(body.article).toEqual(
        expect.objectContaining({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          body: expect.any(String),
          topic: "mitch",
          created_at: expect.any(String),
          votes: 5,
        })
      )
    });
  })
});
