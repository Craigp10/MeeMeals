import React, { useEffect, useState } from "react";
import "./Homepage.css";
import dayjs from "dayjs";
import apis from "../../api/index";
import { Redirect, Link, useHistory } from "react-router-dom";

const GRID_LAYOUT = [
  { style: { gridColumn: 2, gridRow: 1 }, text: "Sunday", isDay: true },
  { style: { gridColumn: 3, gridRow: 1 }, text: "Monday", isDay: true },
  { style: { gridColumn: 4, gridRow: 1 }, text: "Tuesday", isDay: true },
  { style: { gridColumn: 5, gridRow: 1 }, text: "Wednesday", isDay: true },
  { style: { gridColumn: 6, gridRow: 1 }, text: "Thursday", isDay: true },
  { style: { gridColumn: 7, gridRow: 1 }, text: "Friday", isDay: true },
  { style: { gridColumn: 8, gridRow: 1 }, text: "Saturday", isDay: true },
  { style: { gridColumn: 1, gridRow: 2 }, text: "Breakfast", isDay: false },
  { style: { gridColumn: 1, gridRow: 3 }, text: "Lunch", isDay: false },
  { style: { gridColumn: 1, gridRow: 4 }, text: "Dinner", isDay: false },
  { style: { gridColumn: 1, gridRow: 5 }, text: "Snack", isDay: false },
];

const generateCurrentWeek = () => {
  const week = new Array(7)
    .fill(0)
    .map((day, idx) => dayjs().day(idx).format("M/D/YYYY")); //dayjs().format("M/D/YYYY");
  return week;
};

const Home = (props) => {
  const [weekMeals, setWeekMeals] = useState([]);
  const [userMeals, setUserMeals] = useState([]);
  const [week, setWeek] = useState(generateCurrentWeek());
  const history = useHistory();

  useEffect(async () => {
    if (props.user?.id) {
      console.log("pulling for user", props.user);
      await apis
        .pullCalendarWeek({ user_id: props.user.id, week })
        .then((resp) => {
          setWeekMeals(resp.data.meals);
        });

      await apis
        .getUserMeals({ user_id: props.user.id })
        .then((resp) => setUserMeals(resp.data.meals));
    }
  }, [props]);
  console.log("home", weekMeals, userMeals);
  return (
    <div className="home-content-wrapper">
      <div className="home-content-board">
        <div className="home-board-header">
          <h2>Meals for the Week!</h2>
        </div>
        <div className="home-board-body">
          <div className="home-body-grid">
            {GRID_LAYOUT.map((vert, idx) => {
              return vert.isDay ? (
                <div style={vert.style} className="grid-layout-top" key={idx}>
                  <span>{vert.text}</span>
                  <span>{dayjs(week[idx]).format("M/D")}</span>
                </div>
              ) : (
                <div style={vert.style} className="grid-layout-left" key={idx}>
                  <span>{vert.text}</span>
                </div>
              );
            })}

            {weekMeals.length && userMeals.length
              ? weekMeals.map((day, idx) => {
                  return day.pulled ? (
                    <React.Fragment key={day.day}>
                      {userMeals.filter((meal) => meal._id == day?.breakfast)[0]
                        ?.display_name ? (
                        <span
                          className="grid-meal"
                          // onClick={() => Implementation to allow the user to preview a meal from homepage by clicking on it, currently routes to meal page, maybe just use a mealModal here
                          //   history.push({
                          //     pathname: "/meals",
                          //     state: { mealPreview: day.breakfast },
                          //   })
                          // }
                          style={{ gridColumn: idx + 2, gridRow: 2 }}
                        >
                          <p>
                            {
                              userMeals.filter(
                                (meal) => meal._id == day.breakfast
                              )[0]?.display_name
                            }
                          </p>
                        </span>
                      ) : null}
                      {userMeals.filter((meal) => meal._id == day?.lunch)[0]
                        ?.display_name ? (
                        <span
                          className="grid-meal"
                          style={{ gridColumn: idx + 2, gridRow: 3 }}
                        >
                          <p>
                            {
                              userMeals.filter(
                                (meal) => meal._id == day.lunch
                              )[0]?.display_name
                            }
                          </p>
                        </span>
                      ) : null}
                      {userMeals.filter((meal) => meal._id == day?.dinner)[0]
                        ?.display_name ? (
                        <span
                          className="grid-meal"
                          style={{ gridColumn: idx + 2, gridRow: 4 }}
                        >
                          <p>
                            {
                              userMeals.filter(
                                (meal) => meal._id == day.dinner
                              )[0]?.display_name
                            }
                          </p>
                        </span>
                      ) : null}
                      {userMeals.filter((meal) => meal._id == day?.snack)[0]
                        ?.display_name ? (
                        <span
                          className="grid-meal"
                          style={{ gridColumn: idx + 2, gridRow: 5 }}
                        >
                          <p>
                            {
                              userMeals.filter(
                                (meal) => meal._id == day.snack
                              )[0]?.display_name
                            }
                          </p>
                        </span>
                      ) : null}
                    </React.Fragment>
                  ) : null;
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
