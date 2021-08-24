const config = require("../config/auth.config");
const db = require("../models");
const dayjs = require("dayjs");
const User = db.user;
const Role = db.role;
const Calendar = db.calendar;

let bcrypt = require("bcryptjs");
exports.demoSignup = async (req, res) => {
  let demoUser = await User.findOne(
    { email: "demo" + req.sessionID.slice(1, 5) },
    (err, doc) => doc
  );
  if (!demoUser) {
    demoUser = new User({
      username: "demo" + req.sessionID.slice(1, 5),
      email: "demoemail@email.com",
      password: bcrypt.hashSync("demopassword", 8),
      meals: [
        {
          isActive: true,
          display_name: "Spinach Feta pasta w/ cherry tomatoes",
          ingredients: [
            "Cherry Tomatoes",
            "Spinach",
            "pasta of choice",
            "Red Onion",
            "mozzarella",
          ],
          instructions: [
            "Add a some olive oil to a medium-hot pan and sear tomatoes for 1-2 minutes",
            "Lower heat to medium and add more olive oil and chopped red onion",
            "Add in spinach and various spices of choice",
            "After 5-7 minutes move contents to oven safe baking pan, top with mozzerela cheese and bake 20-30 minutes at 350F",
            "Boil pasta and strain, save a little bit of pasta water for sauce",
            "When finished baking add pasta and pasta waster to dish, mix and serve!",
          ],
          tags: ["Baked Dish", "Tik Tok"],
          date_created: "6/3/2021",
          category: "dinner",
          description:
            "First seer the tomatoes with a hot pan, once seared for color lower heat and add oil. Add the onions and garlic, once those are good then everything else. After bake for 30mins.",
        },
        {
          isActive: true,
          display_name: "Sausage, Rice, Peppers dish",
          ingredients: [
            "Sausage",
            "Rice",
            "Bell Peppers",
            "Yellow Onion",
            "garlic",
            "red pepper flakes",
          ],
          instructions: [
            "Add oil and sauate Onions in large skillet pan on medium heat",
            "after 5-7 minutes pour in all veggies of choice (peppers, broccoli, etc...)",
            "Add in sausage and let cook for 4-5 minutes.",
            "Add more oil after 2-3 minutes and toss in garlic and red pepper flakes",
            "1 minutes later add 2 cups of rice of choice and slightly brown the rice",
            "Add in cooking wine and let it cook the alcohol out.",
            "Now add 4 cups of vegetable broth, bring up to boil and lower heat to a simmer. Let cook for 20-25 minutes.",
          ],
          date_created: "7/10/2021",
          category: "lunch",
          description: "",
          tags: ["1 Pot", "Simple"],
        },
        {
          isActive: true,
          display_name: "Cereal",
          ingredients: ["almost milk", "cinnamon toast crunch"],
          tags: ["fast", "simple"],
          instructions: [
            "Pour milk into bowl ;)",
            "Pour in Cinnamon Toast Crunch",
          ],
          date_created: "7/1/2021",
          category: "breakfast",
          description: "Pour milk then pour in cereal",
        },
        {
          isActive: true,
          display_name: "Chicken Parm",
          ingredients: [
            "Chicken breast",
            "Mozzerella Cheese",
            "Breadcrumbs",
            "Egg",
            "Pasta of choice",
          ],
          instructions: [
            "Fry chicken breast until outter crust is golden brown",
            "Place chicken atop sauce oven safe pan, top with mozzerella cheese, bake at 350 for 20-25 minutes",
            "Boil pasta of choice and strain",
            "Once pasta is cooked and the oven is done combine and serve",
          ],
          tags: ["Italian", "Date Nate"],
          date_created: "12/6/2020",
          category: "dinner",
          description:
            "Bread the chicken breast, fry them, make your sauce and pasta, bake everything at 350 for 30 minutes",
        },
        {
          isActive: true,
          display_name: "Pad Thai",
          ingredients: ["Peanut Butter", "egg", "pad thai sauce", "onion"],
          instructions: [
            "Pre soak noodles in room temp water for 10-20 minutes",
            "Combine fish oil, soy sauce, oyster sauce, finely ground peanuts, chili oil, garlic and ginger to make pad thai sauce",
            "Pre heat a large wok to medium-high heat",
            "Pour in oil and noodles into the wok",
            "Toss in veggies of choice (Onion, broccoli, sprouts, etc...",
            "Crack in eggs and scramble until cooked through",
            "Pour in sauce and cook for 2-3 minutes, then serve",
          ],
          tags: ["Nut Allergy", "Thai Food"],
          instructions: [],
          date_created: "5/6/2019",
          category: "dinner",
          description: "",
        },
        {
          isActive: true,
          display_name: "Peanut Butter Toast",
          ingredients: ["Bread of choice", "creamy peanut butter"],
          tags: ["Nut Allergy", "Simple"],
          instructions: [
            "Toast bread until golden brown",
            "Spread peanut butter on bread",
          ],
          date_created: "5/6/2019",
          category: "snack",
          description: "",
        },
        {
          isActive: true,
          display_name: "Spaghetti and Sausage",
          ingredients: ["bread", "creamy peanut butter"],
          instructions: [
            "Make sauce",
            "Simmer sauce",
            "Boil noodles",
            "Combine",
          ],
          tags: ["Italian", "Vegetarian", "Date night"],
          date_created: "8/1/2021",
          category: "dinner",
          description:
            "Delicious vegetarian Italian meal picked up fresh herbs and animal free protein",
        },
      ],
    });

    await demoUser.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
      }
      console.log("New Demo user created", user.meals);
      Calendar.findOne({ date: dayjs().format("M/D/YYYY") }, (err, date) => {
        if (date) {
          Calendar.findOneAndUpdate(
            { date: date, users: { $elemMatch: { user_id: user._id } } },
            {
              $push: {
                users: {
                  user_id: user._id,
                  breakfast: user.meals[2]._id,
                  lunch: user.meals[0]._id,
                  dinner: user.meals[3]._id,
                  snack: user.meals[5]._id,
                },
              },
            },
            { new: true },
            (err, doc) => doc
          );
        } else {
          new Calendar({
            date: dayjs().format("M/D/YYYY"),
            users: [
              {
                user_id: user._id,
                breakfast: user.meals[2]._id,
                lunch: user.meals[0]._id,
                dinner: user.meals[3]._id,
                snack: user.meals[5]._id,
              },
            ],
          }).save((err, date) => {
            if (err) {
              res.status(500).send({ message: err });
            }
            console.log("New Demo date created", date.users);
          });
        }
      });
    });
  }

  req.session.isAuth = true;
  req.session.isDemo = true;

  req.session.user = {
    id: demoUser._id,
    username: demoUser.username,
    email: demoUser.email,
  };

  res.status(200).send({
    id: demoUser._id,
    username: demoUser.username,
    email: demoUser.email,
  });
};
exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Invalid Password!",
        });
      }

      req.session.isAuth = true;
      req.session.isDemo = false;

      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
      };

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
      });
    });
};

exports.getSession = (req, res) => {
  return res.status(200).send({
    sessionID: req.sessionID,
    isAuth: req.session.isAuth,
    user: req.session.user,
    a: "hello",
  });
};

exports.logout = async (req, res) => {
  if (req.session.isDemo) {
    await User.deleteOne({ username: "demo" + req.sessionID.slice(1, 5) });
    await Calendar.collection.drop();
  }

  await req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    console.log("session destoryed");
  });
  return res.status(200).clearCookie("Demo-Session").send({
    success: true,
    message: "Successful logout",
  });
};
