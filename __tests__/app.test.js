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
describe("ERRORS", ()=> {
    it("Status 404 invalid url", () => {
        return request(app)
        .get("/not_an_endpoint")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
        });
    })
    it("Client uses a method on /api/topics which is not allowed", () => {
        return request(app)
        .post("/api/topics")
        .expect(405)
    })
})