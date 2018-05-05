const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const helpers = require("./helpers");
const routes = require("./routes");
const errorHandlers = require("./handlers/errorHandlers");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Takes raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  next();
});

app.use("/", routes);

// error handlers
app.use(errorHandlers.notFound);

app.listen(7777, () => {
  console.log("Server running at 7777");
});
