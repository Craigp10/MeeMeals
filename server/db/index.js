const mongoose = require("mongoose");
require("dotenv").config();
const db_schema = require("../models/index");
const dbConfig = require("../config/db.config");
const Role = db_schema.role;
const Meals = db_schema.meals;
const User = db_schema.user;

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

  User.find({ username: "Craigp10" }, (err, user) => {
    if (!user[0]?.meals.length) {
      const new_meals = [
        {
          isActive: true,
          display_name: "Spinach Feta pasta w/ cherry tomatoes",
          ingredients: [
            "Cherry Tomatoes",
            "Spinach",
            "pasta of choice",
            "onion",
          ],
          date_created: "7/6/2021",
          category: "dinner",
          description:
            "First seer the tomatoes with a hot pan, once seered for color lower heat and add oil. Add the onions and garlic, once those are fraguent then everything else. After bake for 30mins.",
        },
        {
          isActive: true,
          display_name: "Sausage, Rice, Peppers dish",
          ingredients: ["Sausage", "Rice", "Bell Peppers", "Yellow Onion"],
          date_created: "7/10/2021",
          category: "lunch",
          description: "",
        },
        {
          isActive: true,
          display_name: "Cereal",
          ingredients: ["almost milk", "cinnamon toast crunch"],
          date_created: "7/1/2021",
          category: "breakfast",
          description: "Pour milk then pour in cereal",
        },
        {
          isActive: true,
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
          category: "dinner",
          description:
            "Bread the chicken breast, fry them, make your sauce and pasta, bake everything at 350 for 30 minutes",
        },
        {
          isActive: true,
          display_name: "Pad Thai",
          ingredients: ["Peanut Butter", "egg", "pad thai sauce", "onion"],
          date_created: "5/6/2019",
          category: "dinner",
          description: "",
        },
        {
          isActive: true,
          display_name: "Peanut Butter Toast",
          ingredients: ["bread", "creamy peanut butter"],
          date_created: "5/6/2019",
          category: "snack",
          description: "",
        },
      ];
      User.findOneAndUpdate(
        { _id: user[0]._id },
        { $set: { meals: new_meals } },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log("Something wrong when updating data!");
          }

          console.log("Successfully updated user", doc);
        }
      );
    }
  });

  Meals.find({}, (err, meals) => {
    if (!meals.length) {
      [
        {
          user_id: "60e61a2a2990e3bac72f35cc",
          display_name: "Spinach Mozzerla pasta w/ cherry tomatoes",
          ingredients: [
            "Cherry Tomatoes",
            "Spinach",
            "pasta of choice",
            "onion",
          ],
          date_created: "7/6/2021",
          category: "dinner",
          description:
            "First seer the tomatoes with a hot pan, once seered for color lower heat and add oil. Add the onions and garlic, once those are fraguent then everything else. After bake for 30mins.",
        },
        {
          user_id: "60e61a2a2990e3bac72f35cc",
          display_name: "Sausage, Rice, Peppers dish",
          ingredients: ["Sausage", "Rice", "Bell Peppers", "Yellow Onion"],
          date_created: "7/10/2021",
          category: "lunch",
          description: "",
        },
        {
          user_id: "60e61a2a2990e3bac72f35cc",
          display_name: "Cereal",
          ingredients: ["almost milk", "cinnamon toast crunch"],
          date_created: "7/1/2021",
          category: "breakfast",
          description: "Pour milk then pour in cereal",
        },
        {
          user_id: "60e61a2a2990e3bac72f35cc",
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
          category: "dinner",
          description:
            "Bread the chicken breast, fry them, make your sauce and pasta, bake everything at 350 for 30 minutes",
        },
        {
          user_id: "60e61a2a2990e3bac72f35cc",
          display_name: "Pad Thai",
          ingredients: ["Peanut Butter", "egg", "pad thai sauce", "onion"],
          date_created: "5/6/2019",
          category: "dinner",
          description: "",
        },
        {
          user_id: "60e61a2a2990e3bac72f35cc",
          display_name: "Peanut Butter Toast",
          ingredients: ["bread", "creamy peanut butter"],
          date_created: "5/6/2019",
          category: "snack",
          description: "",
        },
      ].forEach((meal) => {
        new Meals(meal).save((err) =>
          console.log(`added ${meal.display_name} to roles collection`)
        );
      });
    }
  });
}

db = mongoose.connection;
module.exports = db;
