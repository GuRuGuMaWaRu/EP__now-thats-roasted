const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const helpers = require("./helpers/helpers");
const routes = require("./routes");
const errorHandlers = require("./handlers/errorHandlers");

// import all of our models
require("./models/Realm");

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

// stupid middleware to test how errors bubble in NodeJS
// app.use((req, res, next) => {
//   req.name = "Peter";
//   if (req.name === "Peter") {
//     throw Error("That is a stupid name!");
//   }
//   next();
// });

app.use("/", routes);

// error handlers
// error handler --- not found error
app.use(errorHandlers.notFound);

// app.use(errorHandlers.hohohoErrors);
// error handler --- production
app.use(errorHandlers.developmentErrors);

app.listen(7777, () => {
  console.log("Server running at 7777");
});
