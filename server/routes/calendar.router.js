const express = require("express");

const controller = require("../controllers/calendar.controller");

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello World!");
});
router.post("/changes", controller.updateChanges);
router.post("/getDateMeals", controller.pullSingleDay);
router.post("/schedule", controller.pullSchedule);

module.exports = router;
