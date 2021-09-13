const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    date_created: String,
    meals: [
      {
        isActive: { type: Boolean, required: true },
        display_name: { type: String, required: true },
        ingredients: { type: [String], required: false },
        instructions: { type: [String], required: false },
        tags: { type: [String], required: false },
        category: { type: String, required: true },
        description: { type: String, required: false },
        date_last_eaten: { type: String, required: false },
        date_created: { type: String, required: true },
      },
    ],
    is_demo: { type: Boolean, required: true },
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
