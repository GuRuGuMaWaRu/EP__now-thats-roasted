const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const promisify = require("es6-promisify");
const flash = require("connect-flash");
const expressValidator = require("express-validator");
const routes = require("./routes");
const helpers = require("./helpers/helpers");
const errorHandlers = require("./handlers/errorHandlers");
require("./handlers/passport");

// create Express app
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// Takes raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gives access to tons of data validation methods
app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// session
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// flash messages
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
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

// promisify some callback based APIs
// app.use((req, res, next) => {
//   req.login = promisify(req.login, req);
//   next();
// });

app.use("/", routes);

// error handlers
// error handler --- not found error
app.use(errorHandlers.notFound);

app.use(errorHandlers.flashValidationErrors);
// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get("env") === "development") {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
