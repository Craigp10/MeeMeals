const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Meals = new Schema(
  {
    display_name: { type: String, required: true },
    ingredients: { type: [String], required: false },
    date_created: { type: String, required: true },
    date_last_eaten: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("meals", Meals);
