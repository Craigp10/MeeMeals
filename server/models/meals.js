const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Meals = new Schema(
  {
    //is id built internally?
    display_name: { type: String, required: true },
    ingredients: { type: [String], required: false },
    date_created: { type: String, required: true },
    date_created: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("meals", Meals);
