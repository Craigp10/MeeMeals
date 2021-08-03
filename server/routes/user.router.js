// const authJWT = require("../middleware/authJWT");
const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();

router.post("/meals", controller.getMeals);

router.post("/newMeal", controller.newMeal);

router.post("/deleteMeal", controller.deleteMeal);
router.post("/editMeal", controller.editMeal);

module.exports = router;
