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
  console.log("DEMO SIGNUP", demoUser);
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
          tags: ["Baked Dish", "Tik Tok"],
          date_created: "7/6/2021",
          category: "dinner",
          description:
            "First seer the tomatoes with a hot pan, once seared for color lower heat and add oil. Add the onions and garlic, once those are good then everything else. After bake for 30mins.",
        },
        {
          isActive: true,
          display_name: "Sausage, Rice, Peppers dish",
          ingredients: ["Sausage", "Rice", "Bell Peppers", "Yellow Onion"],
          date_created: "7/10/2021",
          category: "lunch",
          description: "",
          tags: ["1 Pot", "Simple"],
        },
        {
          isActive: true,
          display_name: "Cereal",
          ingredients: ["almost milk", "cinnamon toast crunch"],
          tags: [],
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
          tags: ["Nut Allergy", "Thai Food"],
          date_created: "5/6/2019",
          category: "dinner",
          description: "",
        },
        {
          isActive: true,
          display_name: "Peanut Butter Toast",
          ingredients: ["bread", "creamy peanut butter"],
          tags: ["Nut Allergy", "Simple"],
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

    demoUser.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
      }
      console.log("New Demo user created", user.meals);
      Calendar.findOne(
        { date: dayjs().format("M/D/YYYY") },
        async (err, date) => {
          if (date) {
            await Calendar.findOneAndUpdate(
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
            await new Calendar({
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
        }
      );
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
