const { selectUsers } = require("../models/users.model.js");

exports.getUsers = (req, res, next) => {
  selectUsers().then((data) => {
    res.status(200).send({ users: data });
  });
};
