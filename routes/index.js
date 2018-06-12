const express = require("express");
const router = express.Router();

const realmController = require("../controllers/realmController");
const { catchErrors } = require("../handlers/errorHandlers");

// router.use((req, res, next) => {
//   console.log(`Time: ${Date.now()}`);
//   next();
// });

router.get("/", realmController.homePage);
router.get("/gondor", realmController.gondorIndex);
router.get("/rohan", realmController.rohanIndex);
router.get("/addRealm", realmController.addRealm);
router.post(
  "/addRealm",
  realmController.upload,
  catchErrors(realmController.resize),
  catchErrors(realmController.createRealm)
);
router.post(
  "/addRealm/:id",
  realmController.upload,
  catchErrors(realmController.resize),
  catchErrors(realmController.updateRealm)
);
router.get("/realms", catchErrors(realmController.getRealms));
router.get("/realms/:id/edit", catchErrors(realmController.editRealm));
router.get("/realm/:slug", catchErrors(realmController.getRealmBySlug));

router.get("/tags", catchErrors(realmController.getRealmsByTag));
router.get("/tags/:tag", catchErrors(realmController.getRealmsByTag));

module.exports = router;
