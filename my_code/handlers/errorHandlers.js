exports.notFound = (req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;

  next(error);
};

exports.errors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    status: err.status,
    message: err.message
  });
};
