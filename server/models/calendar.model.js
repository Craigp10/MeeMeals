const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Calendar = new Schema(
  {
    date: { type: String, required: true },
    users: {
      type: [
        {
          user_id: String,
          breakfast: String,
          lunch: String,
          dinner: String,
          snack: String,
        },
      ],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("calendar", Calendar);
