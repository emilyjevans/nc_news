const { getUsers } = require("../controllers/users.controller.js");
const { invalidMethod } = require("../controllers/errors.controller.js");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers).all(invalidMethod);

module.exports = usersRouter;
