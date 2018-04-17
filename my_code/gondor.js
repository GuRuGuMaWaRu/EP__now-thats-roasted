const express = require("express");
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log(`Time: ${Date.now()}`);
  next();
});

router.get("/", (req, res) => {
  res.render("hello", {
    country: "Gondor",
    direction: "SE"
  });
});

router.get("/about", (req, res) => {
  res.send(
    "At this time in history the lands that will be Gondor some day lie covered in forests and teem with wild life"
  );
});

router.get("/traveltips", (req, res) => {
  const travelTips = {
    directions: "SE",
    distance: 5000
  };

  res.json(travelTips);
});

router.get("/commands", (req, res) => {
  const commandsArr = Object.values(req.query);
  const commandsStr = commandsArr.join("; ");

  res.render("hello", {
    country: req.query.country,
    direction: req.query.directions
  });
});

router.get("/news/:recent", (req, res) => {
  res.send(`Recent news: ${req.params.recent}`);
});

module.exports = router;
