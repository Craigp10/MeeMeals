const authJWT = require("../middleware/authJWT");
const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/test/all", controller.allAccess);

  app.get("/test/user", [authJWT.verifyToken], controller.userBoard);

  app.get(
    "/test/mod",
    [authJWT.verifyToken, authJWT.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/test/admin",
    [authJWT.verifyToken, authJWT.isAdmin],
    controller.adminBoard
  );
};
