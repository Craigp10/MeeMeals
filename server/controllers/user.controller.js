const User = require("../models/user.model");
const dayjs = require("dayjs");

const getMeals = async (req, res) => {
  const body = req.body;
  try {
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
  } catch (e) {
    return res.status(200).json({
      success: false,
      meals: [],
      message: "Error pulling meals",
    });
  }
};

const deleteMeal = async (req, res) => {
  const body = req.body;
  const updatedRecord = await User.findOneAndUpdate(
    { _id: body.user_id, meals: { $elemMatch: { _id: body.meal_id } } },
    { $set: { "meals.$.isActive": false } },
    { new: true },
    (err, doc) => doc
  );
  // console.log(updatedRecord.meals);
  return res.status(201).json({
    success: true,
    meals: updatedRecord.meals.filter((meal) => meal.isActive),
    message: "successfully deleted meal",
  });
};

const newMeal = async (req, res) => {
  const body = req.body;
  const meal = { ...body.meal };
  meal.date_created = dayjs().format("M/D/YYYY");
  meal.isActive = true;
  const updatedRecord = await User.findOneAndUpdate(
    { _id: body.user_id },
    { $addToSet: { meals: meal } }, //DO NOT USE $PUSH, it was pushing duplicate entries
    { upsert: true },
    (err, doc) => doc
  );
  return res.status(201).json({
    success: true,
    meals: updatedRecord.meals,
    message: "Meal successfully created",
  });
};

const editMeal = async (req, res) => {
  const body = req.body;
  const meal = { ...body.meal };
  // meal._id = body._id;
  meal.date_created = dayjs().format("M/D/YYYY");
  meal.isActive = true;
  const updatedRecord = await User.findOneAndUpdate(
    { _id: body.user_id, meals: { $elemMatch: { _id: meal._id } } },
    { $set: { "meals.$": meal } }, //DO NOT USE $PUSH, it was pushing duplicate entries
    { new: true },
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
  getMeals,
  newMeal,
  deleteMeal,
  editMeal,
};
