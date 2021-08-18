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

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:8000", "http://52.2.53.62"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log("pre-redis");
const redis = new Redis({
  //client to our redis store
  port: Number(sessionConfig.REDIS_PORT),
  host: sessionConfig.REDIS_HOST,
  password: sessionConfig.REDIS_PASSWORD,
});
console.log("redis", redis);

const RedisStore = connectRedis(session);
const redisStore = new RedisStore({
  client: redis,
});
console.log("redisStore", redisStore);
app.use(
  session({
    //data store for express session
    store: redisStore, //stores session in our redis store
    name: sessionConfig.COOKIE_NAME, //Cookie name
    sameSite: "Strict", //security implementation so that our session doesn't hold cookies from other domains
    secret: sessionConfig.SESSION_SECRET, //Secret to validate/save
    resave: false, //Creates new session every request if true
    saveUninitialized: false, //If session isn't modified we don't want to save
    cookie: {
      path: "/",
      httpOnly: true, //this allows JS from accessing cookie, avoids attacks in the browser
      secure: false,
      maxAge: 1000 * 60 * 30, //30minutes //60 * 8, //expires in 8 hours
    },
  })
);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.all("*", (req, res, next) => {
  if (!req.session.isAuth) {
    req.session.isAuth = false;
  }

  next();
});

app.use("/api/meals", mealsRouter);
app.use("/api/auth", authRouter); //currently get error with this... need to spend some time learning express more.
app.use("/api/user", userRouter);
app.use("/api/calendar", calendarRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
