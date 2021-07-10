const mongoose = require("mongoose");
require("dotenv").config();
const db_schema = require("../models/index");
const dbConfig = require("../config/db.config");
const Role = db_schema.role;
const Meals = db_schema.meals;

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
  })
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

  if (Meals.find().length == 0) {
    [
      {
        display_name: "Spinach Mozzerla pasta w/ cherry tomatoes",
        ingredients: ["Cherry Tomatoes", "Spinach", "pasta of choice", "onion"],
        date_created: "7/6/2021",
        description:
          "First seer the tomatoes with a hot pan, once seered for color lower heat and add oil. Add the onions and garlic, once those are fraguent then everything else. After bake for 30mins.",
      },
      {
        display_name: "Sausage, Rice, Peppers dish",
        ingredients: ["Sausage", "Rice", "Bell Peppers", "Yellow Onion"],
        date_created: "7/10/2021",
        description: "",
      },
      {
        display_name: "Cereal",
        ingredients: ["almost milk", "cinnamon toast crunch"],
        date_created: "7/1/2021",
        description: "Pour milk then pour in cereal",
      },
      {
        display_name: "Chicken Parm",
        ingredients: [
          "Chicken breast",
          "basil",
          "cheese",
          "breadcrumbs",
          "egg",
          "pasta",
        ],
        date_created: "12/6/2020",
        description:
          "Bread the chicken breast, fry them, make your sauce and pasta, bake everything at 350 for 30 minutes",
      },
      {
        display_name: "Pad Thai",
        ingredients: ["Peanut Butter", "egg", "pad thai sauce", "onion"],
        date_created: "5/6/2019",
        description: "",
      },
    ].forEach((meal) => {
      new Meals(meal).save((err) =>
        console.log(`added ${meal.display_name} to roles collection`)
      );
    });
  }
}

db = mongoose.connection;
module.exports = db;
