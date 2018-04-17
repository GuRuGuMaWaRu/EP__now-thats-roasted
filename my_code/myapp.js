const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const gondorRoutes = require("./gondor");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/gondor", gondorRoutes);

// app.set("port", 7777);

// const server = app.listen(app.get("port"), () => {
//   console.log(`Server running at ${server.address().port}`);
// });

app.listen(7777, () => {
  console.log("Server running at 7777");
});
