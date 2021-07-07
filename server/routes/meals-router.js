const express = require("express");

const Meals = require("../controllers/meals-ctrl");

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello World!");
});
router.post("/meal", Meals.createMeal);
router.get("/meals", Meals.getMeals);
router.post("/meals", Meals.deleteAllMeals);

module.exports = router;
