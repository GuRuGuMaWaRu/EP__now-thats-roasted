const express = require("express");
const router = express.Router();
const realmController = require("../controllers/realmController");

router.use(function timeLog(req, res, next) {
  console.log(`Time: ${Date.now()}`);
  next();
});

router.get("/", realmController.homePage);
router.get("/gondor", realmController.gondorIndex);
router.get("/rohan", realmController.rohanIndex);

module.exports = router;
