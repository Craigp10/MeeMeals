const Calendar = require("../models/calendar.model");

updateChanges = async (req, res) => {
  try {
    const { user_id, changes, date } = req.body;
    const dateExist = await Calendar.findOne({ date: date }, (err, doc) => doc);
    if (!dateExist) {
      let newDateObj = {
        date: date,
        users: [
          {
            user_id: user_id,
            breakfast: changes.breakfast,
            lunch: changes.lunch,
            dinner: changes.dinner,
            snack: changes.snack,
          },
        ],
      };
      new Calendar(newDateObj).save();
    } else {
      const userExist = await Calendar.findOne(
        { date: date, users: { $elemMatch: { user_id: user_id } } },
        (err, doc) => doc
      );
      // console.log(userExist);
      if (userExist) {
        const results = await Calendar.findOneAndUpdate(
          { date: date, users: { $elemMatch: { user_id: user_id } } },
          { $set: { "users.$": { user_id: user_id, ...changes } } },
          { new: true },
          (err, doc) => doc
        );
        // console.log("results", results);
      } else {
        Calendar.findOneAndUpdate(
          { date: date },
          { $push: { users: { user_id: user_id, ...changes } } },
          { new: true },
          (err, doc) => doc
        );
      }
    }
    return res.status(200).json({
      success: true,
      message: "Successfully updated date",
    });
  } catch (e) {
    return res
      .status(400)
      .json({ success: false, error: e, message: "Unable to update date" });
  }
};

pullSingleDay = async (req, res) => {
  try {
    const { date, user_id } = req.body;
    const date_ = await Calendar.findOne(
      { date: date, users: { $elemMatch: { user_id: user_id } } },
      (err, doc) => {
        if (err) {
          return res.status(400).json({ success: false, error: err });
        }
        return doc;
      }
    );
    if (date_) {
      const data = date_.users.filter((user) => user.user_id == user_id)[0];
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(204).json({
        success: true,
        message: "No data for user on date",
        data: {},
      });
    }
  } catch (e) {
    return res.status(400).json({
      success: false,
      error: e.message,
      message: "Unable to pull date",
    });
  }
};

pullSchedule = async (req, res) => {
  const { week, user_id } = req.body;
  // console.log(week, user_id);
  // console.log(week, user_id);
  const weekMeals = await Calendar.find(
    {
      date: { $in: week },
    },
    (err, doc) => {
      if (err) console.log(err);
      return doc;
    }
  );
  // console.log(weekMeals);

  const returnWeek = week.map((day) => {
    const returned = weekMeals.filter((date) => {
      return date.date == day;
    });
    if (returned.length) {
      return {
        breakfast: returned[0]?.users.filter(
          (user) => user.user_id == user_id
        )[0]?.breakfast,
        lunch: returned[0]?.users.filter((user) => user.user_id == user_id)[0]
          ?.lunch,
        dinner: returned[0]?.users.filter((user) => user.user_id == user_id)[0]
          ?.dinner,
        snack: returned[0]?.users.filter((user) => user.user_id == user_id)[0]
          ?.snack,
        day,
        pulled: true,
      };
    } else {
      return { day, pulled: false };
    }
  });

  return res.status(200).json({
    success: true,
    message: "No data for user on date",
    meals: returnWeek,
  });
};

module.exports = {
  pullSchedule,
  pullSingleDay,
  updateChanges,
};
