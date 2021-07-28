import React, { useEffect, useState } from "react";
import "./Homepage.css";
import dayjs from "dayjs";
import apis from "../../api/index";

// const GRID_LAYOUT = [
//   { style: { gridColumn: 1, gridRow: 2 }, text: "Breakfast" },
//   { style: { gridColumn: 1, gridRow: 3 }, text: "Lunch" },
//   { style: { gridColumn: 1, gridRow: 4 }, text: "Dinner" },
//   { style: { gridColumn: 1, gridRow: 5 }, text: "Snack" },
//   { style: { gridColumn: 2, gridRow: 1 }, text: "Sunday" },
//   { style: { gridColumn: 3, gridRow: 1 }, text: "Monday" },
//   { style: { gridColumn: 4, gridRow: 1 }, text: "Tuesday" },
//   { style: { gridColumn: 5, gridRow: 1 }, text: "Wednesday" },
//   { style: { gridColumn: 6, gridRow: 1 }, text: "Thursday" },
//   { style: { gridColumn: 7, gridRow: 1 }, text: "Friday" },
//   { style: { gridColumn: 8, gridRow: 1 }, text: "Saturday" },
// ];

const generateCurrentWeek = () => {
  const week = new Array(7)
    .fill(0)
    .map((day, idx) => dayjs().day(idx).format("M/D/YYYY")); //dayjs().format("M/D/YYYY");
  return week;
};

const Home = () => {
  const [weekMeals, setWeekMeals] = useState([]);
  const [userMeals, setUserMeals] = useState([]);

  useEffect(async () => {
    const week = generateCurrentWeek();
    await apis
      .pullCalendarWeek({ user_id: "60f5ffcaf12aefb5c7942f63", week })
      .then((resp) => {
        console.log("resp", resp);
        setWeekMeals(resp.data.meals);
      });

    await apis
      .getUserMeals({ user_id: "60f5ffcaf12aefb5c7942f63" })
      .then((resp) => setUserMeals(resp.data.meals));

    //fetch user meals for current week.
  }, []);
  console.log("w", weekMeals, userMeals);
  return (
    <div className="home-content-wrapper">
      <div className="home-content-board">
        <div className="home-board-header">
          <h2>Welcome to Home Page!</h2>
        </div>
        <div className="home-board-body">
          <div className="home-body-grid">
            <div>
              <div></div>
            </div>
            <span style={{ gridColumn: 1, gridRow: 2 }}>Breakfast</span>
            <span style={{ gridColumn: 1, gridRow: 3 }}>Lunch</span>
            <span style={{ gridColumn: 1, gridRow: 4 }}>Dinner</span>
            <span style={{ gridColumn: 1, gridRow: 5 }}>Snack</span>
            <span style={{ gridColumn: 2, gridRow: 1 }}>Sunday</span>
            <span style={{ gridColumn: 3, gridRow: 1 }}>Monday</span>
            <span style={{ gridColumn: 4, gridRow: 1 }}>Tuesday</span>
            <span style={{ gridColumn: 5, gridRow: 1 }}>Wednesday</span>
            <span style={{ gridColumn: 6, gridRow: 1 }}>Thursday</span>
            <span style={{ gridColumn: 7, gridRow: 1 }}>Friday</span>
            <span style={{ gridColumn: 8, gridRow: 1 }}>Saturday</span>
            {/* {GRID_LAYOUT.map((vert, idx) => (
              <div style={vert.style}>{vert.text}</div>
            ))} */}

            {weekMeals.length && userMeals.length
              ? weekMeals.map((day, idx) => {
                  return day.pulled ? (
                    <>
                      {userMeals.filter((meal) => meal._id == day?.breakfast)[0]
                        ?.display_name ? (
                        <span
                          className="grid-meal"
                          style={{ gridColumn: idx + 1, gridRow: 2 }}
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
                          style={{ gridColumn: idx + 1, gridRow: 3 }}
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
                          style={{ gridColumn: idx + 1, gridRow: 4 }}
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
                          style={{ gridColumn: idx + 1, gridRow: 5 }}
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
                    </>
                  ) : // <span>{day.day}</span>
                  null;
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
