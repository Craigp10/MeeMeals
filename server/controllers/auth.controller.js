const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

let bcrypt = require("bcryptjs");

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
  console.log("Check Session", req.sessionID, req.session.isAuth);

  return res.status(200).send({
    sessionID: req.sessionID,
    isAuth: req.session.isAuth,
    user: req.session.user,
    a: "hello",
  });
};

exports.logout = async (req, res) => {
  console.log("logout called");
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
