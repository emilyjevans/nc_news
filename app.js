const express = require("express");
const { PSQLerror, customError } = require("./controllers/errors.controller");
const app = express();
const { apiRouter } = require("./routes/api.router")

app.use('/api', apiRouter)

app.use(PSQLerror)

app.use(customError)

app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Not found" });
});

module.exports = app;