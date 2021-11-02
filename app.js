const express = require("express");
const { PSQLerror } = require("./controllers/errors.controller");
const app = express();
const { apiRouter } = require("./routes/api.router")

app.use('/api', apiRouter)

app.use(PSQLerror)

app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Invalid URL" });
});

module.exports = app;