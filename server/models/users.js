const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = new Schema(
  {
    //is id built internally?
    username: { type: String, required: true },
    email: { type: String, required: false },
    password: { type: String, required: true },
    date_created: { type: String, required: true },
    calendar: { type: [Object], required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", Users);
