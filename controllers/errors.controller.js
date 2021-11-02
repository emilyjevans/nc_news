

exports.invalidMethod = (req, res, next) => {
  res.status(405).send({ msg: "Invalid method" });
};

exports.PSQLerror = (err, req, res, next) => {
  if (err.code === '22P02'){
    res.status(400).send({msg: 'Bad request'})
  }
  else {
    next()
  }
}