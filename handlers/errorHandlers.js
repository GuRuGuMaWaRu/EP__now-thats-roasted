exports.notFound = (req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;

  next(error);
};

exports.catchErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

// exports.hohohoErrors = (err, req, res, next) => {
//   err.stack = err.stack || "";

//   const errorDetails = {
//     status: "99999",
//     message: "99999",
//     stackHighlighted: err.stack.replace(
//       /[a-z_-\d]+.js:\d+:\d+/gi,
//       "<mark>$&</mark>"
//     )
//   };

//   res.status(err.status || 500);
//   res.render("error", errorDetails);
// };

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";

  const errorDetails = {
    status: err.status,
    message: err.message,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    )
  };

  res.status(err.status || 500);
  res.format({
    "text/html": () => {
      res.render("error", errorDetails);
    },
    "application/json": () => res.json(errorDetails)
  });
};

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    status: err.status,
    message: err.message
  });
};
