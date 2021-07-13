const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const mealsRouter = require("./routes/meals.router");
const app = express();
const userRouter = require("./routes/user.router"); //(app);
const authRouter = require("./routes/auth.router"); //(app);
const calendarRouter = require("./routes/calendar.router");
const apiPort = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});

app.use("/api", mealsRouter);
app.use("/auth", authRouter); //currently get error with this... need to spend some time learning express more.
app.use("/user", userRouter);
app.use("/calendar", calendarRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
