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
    meals: user.meals.filter((meal) => meal.isActive),
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
  meal.display_name = body.meal.mealName;
  meal.date_created = dayjs().format("M/D/YYYY");
  meal.ingredients = body.meal.mealIngredients;
  meal.description = body.meal.mealDescription;
  meal.category = body.meal.mealCategory;
  meal.tags = body.meal.mealTags;
  meal.instructions = body.meal.mealInstructions;
  const updatedRecord = await User.findOneAndUpdate(
    { _id: body.user_id },
    { $addToSet: { meals: meal } }, //DO NOT USE $PUSH, it was pushing duplicate entries
    { upsert: true },
    (err, doc) => doc
  );
  // console.log(updatedRecord);
  return res.status(201).json({
    success: true,
    meals: updatedRecord.meals,
    message: "Meal successfully created",
  });
};

const editMeal = async (req, res) => {
  const body = req.body;
  const meal = {};
  meal._id = body.meal._id;
  meal.display_name = body.meal.mealName;
  meal.date_created = dayjs().format("M/D/YYYY");
  meal.ingredients = body.meal.mealIngredients;
  meal.description = body.meal.mealDescription;
  meal.category = body.meal.mealCategory;
  meal.tags = body.meal.mealTags;
  meal.instructions = body.meal.mealInstructions;
  const updatedRecord = await User.findOneAndUpdate(
    { _id: body.user_id, meals: { $elemMatch: { _id: body.meal._id } } },
    { $set: { "meals.$": meal } }, //DO NOT USE $PUSH, it was pushing duplicate entries
    // { new: true },
    (err, doc) => doc
  );
  newMeals = await User.findOne({ _id: body.user_id });
  return res.status(201).json({
    success: true,
    meals: newMeals.meals,
    message: "Meal successfully updated",
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
  editMeal,
};
