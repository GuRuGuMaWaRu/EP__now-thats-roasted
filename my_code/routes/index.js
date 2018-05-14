const express = require("express");
const router = express.Router();

const realmController = require("../controllers/realmController");
const { catchErrors } = require("../handlers/errorHandlers");

router.use((req, res, next) => {
  console.log(`Time: ${Date.now()}`);
  next();
});

router.get("/", realmController.homePage);
router.get("/gondor", realmController.gondorIndex);
router.get("/rohan", realmController.rohanIndex);
router.get("/addRealm", realmController.addRealm);
router.post("/addRealm", realmController.createRealm);

module.exports = router;
