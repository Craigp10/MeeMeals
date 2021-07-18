const User = require("../models/user.model");

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

const pullDate = (req, res) => {
  const body = req.body;
  console.log("body", body);
  const calendar = User.findOne({
    _id: req._id,
    calendar: { date: "7/12/21" },
  });
  console.log(calendar);
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
  console.log(updatedRecord);
  return res.status(201).json({
    success: true,
    meals: updatedRecord.meals,
    message: "successfully deleted meal",
  });
};

const newMeal = async (req, res) => {
  const body = req.body;
  console.log("newMeal", body);
  const meal = body;
  meal.display_name = body.meal.meal_name;
  meal.date_created = "";
  meal.ingredients = body.meal.meal_ingredients;
  meal.description = body.meal.meal_description;
  meal.category = body.meal.meal_category;
  console.log(meal);
  const updatedRecord = await User.findOneAndUpdate(
    { _id: body.user_id }, //body._id },
    { $push: { meals: meal } }, //.meal } },
    (err, doc) => doc
  );
  console.log(updatedRecord);
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
  pullDate,
  getMeals,
  newMeal,
  deleteMeal,
};
