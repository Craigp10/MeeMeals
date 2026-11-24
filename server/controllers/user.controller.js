const User = require("../models/user.model");
const Calendar = require("../models/calendar.model");
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

const deleteDemoUsers = async (req, res) => {
  console.log("deleteDemoUsers called");
  await User.deleteMany({ is_demo: true }, (err, doc) => doc);
  console.log("deleteDemoUsers finished");
};

// Deletes a single demo user and removes their entries from every calendar date.
// Used on demo logout and when a demo session expires in Redis.
const deleteDemoUserData = async (username) => {
  const demoUser = await User.findOne({ username, is_demo: true });
  if (!demoUser) return false;

  const userId = String(demoUser._id);
  await Calendar.updateMany(
    { "users.user_id": userId },
    { $pull: { users: { user_id: userId } } }
  );
  // Drop any calendar dates left with no users
  await Calendar.deleteMany({ users: { $size: 0 } });
  await User.deleteOne({ _id: demoUser._id });
  console.log(`Deleted demo user ${username} and their calendar entries`);
  return true;
};

module.exports = {
  getMeals,
  newMeal,
  deleteMeal,
  editMeal,
  deleteDemoUsers,
  deleteDemoUserData,
};
