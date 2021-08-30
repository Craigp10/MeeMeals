const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World Auth!");
});

router.post(
  "/signup",
  verifySignUp.checkDuplicateUsernameOrEmail,
  controller.signup
);

router.get(
  "/demoSignup",
  // verifySignUp.checkDuplicateUsernameOrEmail,
  controller.demoSignup
);

router.post("/signin", controller.signin);

router.get("/checkSession", controller.getSession);
router.get("/logout", controller.logout);

module.exports = router;
