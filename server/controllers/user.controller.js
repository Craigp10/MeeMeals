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
      username: "Craigp10",
    },
    (err, doc) => doc
  );

  return res.status(201).json({
    success: true,
    meals: user.meals,
    message: "Meals successfully pulled",
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
  User.update(
    { _id: body.user_id }, //body._id },
    { $push: { meals: meal } }, //.meal } },
    { new: true },
    (err, doc) => doc
  );
};

module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
  pullDate,
  getMeals,
  newMeal,
};
