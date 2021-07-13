const authJWT = require("../middleware/authJWT");
const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();

router.get("/test/all", controller.allAccess);
router.get("/test/user", [[authJWT.verifyToken]], controller.userBoard);

router.get(
  "/test/mod",
  [authJWT.verifyToken, authJWT.isModerator],
  controller.moderatorBoard
);

router.get(
  "/test/admin",
  [authJWT.verifyToken, authJWT.isAdmin],
  controller.adminBoard
);

router.post("/meals", controller.getMeals);

router.post("/pullDate", controller.pullDate);

module.exports = router;
