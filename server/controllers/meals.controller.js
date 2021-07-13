const Meals = require("../models/meals.model");
const Users = require("../models/user.model");
getMeals = async (req, res) => {
  await Meals.find({}, (err, meals) => {
    console.log("meals", meals);
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!meals.length) {
      return res.status(404).json({ success: false, error: `Movie not found` });
    }

    // const user = Users.findOne({ _id: meals[0].user_id }, (err, user) => { //works as intended
    //   console.log(user);
    // });

    return res.status(200).json({ success: true, data: meals });
  }).catch((err) => console.log(err));
};

createMeal = (req, res) => {
  const body = req.body;
  console.log("Creating meal", body);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a movie",
    });
  }

  const meal = new Meals(body);

  if (!meal) {
    return res.status(400).json({ success: false, error: err });
  }

  meal
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: meal._id,
        message: "meal created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "meal not created!",
      });
    });
};

deleteAllMeals = (req, res) => {
  const body = req.body;
  Meals.deleteMany({}, (err, elses) => {
    console.log(elses);
  });
  return res.status(202).json({});
};

module.exports = {
  getMeals,
  createMeal,
  deleteAllMeals,
};
