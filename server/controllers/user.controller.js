const User = require("../models/user.model");
const dayjs = require("dayjs");

const allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

const userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

const adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

const moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

const getMeals = async (req, res) => {
  const body = req.body;
  const user = await User.findOne(
    {
      _id: body.user_id,
    },
    (err, doc) => doc
  );

  return res.status(201).json({
    success: true,
    meals: user.meals,
    message: "Meals successfully pulled",
  });
};

const deleteMeal = async (req, res) => {
  const body = req.body;
  console.log("deleteMeal", body);
  const updatedRecord = await User.findOneAndUpdate(
    { _id: body.user_id },
    { $pull: { meals: { _id: body.meal_id } } },
    (err, doc) => doc
  );
  // console.log(updatedRecord);
  return res.status(201).json({
    success: true,
    meals: updatedRecord.meals,
    message: "successfully deleted meal",
  });
};

const newMeal = async (req, res) => {
  const body = req.body;
  const meal = {};
  meal.display_name = body.meal.meal_name;
  meal.date_created = dayjs().format("M/D/YYYY");
  meal.ingredients = body.meal.meal_ingredients;
  meal.description = body.meal.meal_description;
  meal.category = body.meal.meal_category;
  meal.tags = body.meal.meal_tags;
  meal.ingredients = body.meal.meal_ingredients;
  meal.instructions = body.meal.meal_instructions;
  console.log("new meal", meal);
  const updatedRecord = await User.findOneAndUpdate(
    { _id: body.user_id },
    { $addToSet: { meals: meal } }, //DO NOT USE $PUSH, it was pushing duplicate entries.
    (err, doc) => doc
  );
  // console.log("updatedRecord", updatedRecord);
  return res.status(201).json({
    success: true,
    meals: updatedRecord.meals,
    message: "Meal successfully created",
  });
};

module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
  getMeals,
  newMeal,
  deleteMeal,
};
