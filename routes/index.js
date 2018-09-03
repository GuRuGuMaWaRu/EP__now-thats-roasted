const express = require("express");
const router = express.Router();

const realmController = require("../controllers/realmController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandlers");

// router.use((req, res, next) => {
//   console.log(`Time: ${Date.now()}`);
//   next();
// });

router.get("/", realmController.homePage);
router.get("/gondor", realmController.gondorIndex);
router.get("/rohan", realmController.rohanIndex);
router.get("/addRealm", authController.isLoggedIn, realmController.addRealm);
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

router.get("/login", userController.loginForm);
router.post("/login", authController.login);
router.get("/register", userController.registerForm);
router.post(
  "/register",
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get("/logout", authController.logout);
router.get("/account", authController.isLoggedIn, userController.account);
router.post("/account", catchErrors(userController.updateAccount));
router.post("/account/forgot", catchErrors(authController.forgot));
router.get("/account/reset/:token", catchErrors(authController.reset));
router.post(
  "/account/reset/:token",
  authController.comparePasswords,
  catchErrors(authController.update)
);

/*

  API

*/

router.get("/api/search", catchErrors(realmController.searchRealms));

module.exports = router;
