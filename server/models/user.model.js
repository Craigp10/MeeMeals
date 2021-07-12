const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    calendar: [
      {
        breakfast: Object,
        lunch: Object,
        dinner: Object,
        snack: Object,
      },
    ],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = User;
