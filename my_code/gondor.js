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

router.get("/aboutGondor", (req, res) => {
  res.render("content1", {
    country: "Gondor",
    title: "Gondor Travelogue"
  });
});

router.get("/aboutRohan", (req, res) => {
  res.render("content1", {
    country: "Rohan",
    title: "Rohan Travelogue"
  });
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
