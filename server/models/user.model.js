const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    // calendar: [
    //   {
    //     breakfast: Object,
    //     lunch: Object,
    //     dinner: Object,
    //     snack: Object,
    //   },
    // ],
    meals: [
      {
        display_name: { type: String, required: true },
        user_id: { type: String, required: true },
        ingredients: { type: [String], required: false },
        date_created: { type: String, required: true },
        date_last_eaten: { type: String, required: false },
        description: { type: String, required: false },
        category: { type: String, required: true },
      },
    ],
    roles: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
        },
      ],
      required: false,
    },
  })
);

module.exports = User;
