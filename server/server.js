const express = require("express");
const session = require("express-session");
const connectRedis = require("connect-redis");
const sessionConfig = require("./config/session.config.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const mealsRouter = require("./routes/meals.router");
const app = express();
const userRouter = require("./routes/user.router"); //(app);
const authRouter = require("./routes/auth.router"); //(app);
const calendarRouter = require("./routes/calendar.router");
const Redis = require("ioredis");
const apiPort = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const redis = new Redis({
  //client to our redis store
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});
const RedisStore = connectRedis(session);
const redisStore = new RedisStore({
  client: redis,
});

app.use(
  session({
    //data store for express session
    store: redisStore, //stored in our redis store
    name: sessionConfig.COOKIE_NAME,
    sameSite: "Strict", //security implementation so that our session doesn't hold cookies from other domains
    secret: sessionConfig.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      httpOnly: true, //this allows JS from accessing cookie, avoids attacks in the browser
      secure: false,
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello Worlds!");
  console.log("SESSION", req.session);
});

app.use("/meals", mealsRouter);
app.use("/auth", authRouter); //currently get error with this... need to spend some time learning express more.
app.use("/user", userRouter);
app.use("/calendar", calendarRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
