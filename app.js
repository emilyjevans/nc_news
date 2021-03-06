const express = require("express");
const { PSQLerror, customError } = require("./controllers/errors.controller");
const app = express();
const { apiRouter } = require("./routes/api.router");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(PSQLerror);

app.use(customError);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;
