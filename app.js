const express = require("express");
const app = express();
const { apiRouter } = require("./routes/api.router")
const { invalidMethod } = require("./controllers/errors.controller")

app.use('/api', apiRouter)

app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Invalid URL" });
});

module.exports = app;