const mongoose = require("mongoose");
require("dotenv").config();
const db_schema = require("../models/index");
const Role = db_schema.role;

mongoose
  .connect(
    // `mongodb://${process.env.HOST}:${process.env.PORT}/${process.env.DB}`,
    `mongodb://127.0.0.1:27017/Mi_Meals`,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  console.log("INITIAL CALLED");
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

db = mongoose.connection;
module.exports = db;
