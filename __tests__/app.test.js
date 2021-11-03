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
            comment_count: 2,
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
      .send({ inc_votes: 5, name: "Mitch" })
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

//* This one is supposed to have comment count *//
//* Need to have filter by author in here too *//
describe("GET /api/articles", () => {
  it("responds with status 200 and an articles array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Array);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  it("should sort by date descending by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toBeSorted({ ascending: false });
        // expect(body.articles).toBeSortedBy("created_at")
        // Does the date data type need converting?
      });
  });
  it("should accept sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toBeSortedBy("article_id");
      });
  });
  it("should accept ascending or descending", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toBeSorted({ ascending: true });
      });
  });
  it("should be able to filter by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(1);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "cats",
            })
          );
        });
      });
  });
  it("should be able to filter by author", () => {
    return request(app)
      .get("/api/articles?author=butter_bridge")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(3);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: "butter_bridge",
            })
          );
        });
      });
  });
  it("should be able to use all three queries", () => {
    return request(app)
      .get("/api/articles?topic=cats&order=asc&sort_by=article_id")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(1);
        expect(body.articles).toBeSorted({ ascending: true });
        expect(body.articles).toBeSortedBy("article_id");
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "cats",
            })
          );
        });
      });
  });
});

// Error handling

describe("ERRORS - GET /api/articles", () => {
  it("returns a 400 bad request for sort_by a column that doesn't exist", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_variable")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("returns a 400 bad request for order which isn't 'asc' or 'desc' ", () => {
    return request(app)
      .get("/api/articles?order=not_an_order")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("returns a 400 Not Found for topic which is not in the database", () => {
    return request(app)
      .get("/api/articles?topic=not_a_topic")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Not found");
      });
  }); //Coming back to this when brain is less fried :) Error code 204 when topic exists but no articles
});

describe("GET /api/articles/:article_id/comments", () => {
  it("should respond with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(2);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
});

// Error handling 

describe("GET /api/articles/:article_id/comments", () => {
  it("returns a 404 not found for an article id that doesn't exist", () => {
    return request(app)
    .get("/api/articles/999999/comments")
    .expect(404)
    .then((response) => {
      const { body } = response;
      expect(body.msg).toEqual("No article found for article_id: 999999");
    });
  })
  it("returns a status 400 and bad request for a bad article_id", () => {
    return request(app)
      .get("/api/articles/not_an_article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
}) 

describe.only("POST /api/articles/:article_id/comments", () => {
  it("should take a request body with properties username and body and respond with the posted comment", () => {
    const myComment = {username: "lurker", body: "A very interesting comment"}
    return request(app)
    .post("/api/articles/3/comments")
    .send(myComment)
    .expect(201)
    .then(({body}) => {
      expect(body.comment).toEqual(expect.objectContaining({
        comment_id: expect.any(Number),
        body: "A very interesting comment",
        votes: 0,
        author: "lurker",
        article_id: 3, 
        created_at: expect.any(String)
      }))
    })
  })
})

// 