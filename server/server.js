const express = require("express");
const session = require("express-session");
const connectRedis = require("connect-redis");
const sessionConfig = require("./config/session.config.js");
const awsConfig = require("./config/aws.config.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const mealsRouter = require("./routes/meals.router");
const app = express();
const userRouter = require("./routes/user.router"); //(app);
const authRouter = require("./routes/auth.router"); //(app);
const calendarRouter = require("./routes/calendar.router");
const User = require("./models/user.model");
const Redis = require("ioredis");
const { requireAuth, enforceSessionExpiry } = require("./middleware");
const { listenForSessionExpiry } = require("./events/sessionExpiry");
const { SESSION_MAX_AGE_MS } = require("./sessionDuration");
const apiPort = 8080;
require("./cron/index")();


const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [awsConfig.AWS_DOMAIN]
    : ['http://localhost:8000', 'http://0.0.0.0:8000'];

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const redis = new Redis({
  //client to our redis store
  port: Number(sessionConfig.REDIS_PORT),
  host: sessionConfig.REDIS_HOST,
  password: sessionConfig.REDIS_PASSWORD,
});

listenForSessionExpiry(redis);

const RedisStore = connectRedis(session);
const redisStore = new RedisStore({
  client: redis,
});

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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: SESSION_MAX_AGE_MS,
    }
  })
);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(enforceSessionExpiry);

// Note: don't write to req.session for unauthenticated requests. Doing so
// saves a brand new session (and sends a new cookie) whenever the old one
// has expired, which kept expired users looking "logged in".

app.use("/api/meals", mealsRouter);
app.use("/api/auth", authRouter); //currently get error with this... need to spend some time learning express more.
app.use("/api/user", requireAuth, userRouter);
app.use("/api/calendar", requireAuth, calendarRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
