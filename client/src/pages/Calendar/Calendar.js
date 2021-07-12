import React, { useState, useEffect, useCallback } from "react";
import "./Calendar.css";
import apis from "../../api/index";
import MealDrop from "../../components/MealDrop/MealDrop";
import FilterSelection from "../../components/SelectionFilter/SelectionFilter";
import DateSelector from "../../components/DateSelector/DateSelector";
import dayjs from "dayjs";

const MEAL_TIMES = [
  { meal_time: "Breakfast", meal: {} },
  { meal_time: "Lunch", meal: {} },
  { meal_time: "Dinner", meal: {} },
  { meal_time: "Snack", meal: {} },
];

const Calendar = (props) => {
  const [activeDate, setActiveDate] = useState(dayjs().format("M/D/YYYY"));
  const [meals, setMeals] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [activeMealClick, setActiveMealClick] = useState(false);
  const [activeMeal, setActiveMeal] = useState({});
  const [changes, setChanges] = useState([]);

  const handleMealClick = (index) => {
    setActiveMealClick(!activeMealClick);
    if (activeMealClick) {
      setActiveMeal({});
    } else {
      setActiveMeal(meals[index]);
    }
  };

  const handleMealRemoveClick = (index) => {
    MEAL_TIMES[index].meal = {};
  };

  const handleMealDropClick = (index) => {
    MEAL_TIMES[index].meal = { ...activeMeal };
    setActiveMealClick(false);
    setActiveMeal({});
  };

  useEffect(async () => {
    await apis.getAllMeals().then((resp) => setMeals(resp.data.data));

    return () => {
      //save changes
      console.log("SAVING CHANGES");
    };
  }, []);

  useEffect(() => {
    // await apis.getAllMeals().then((resp) => setMeals(resp.data.data));

    return () => {
      //save changes
      console.log("SAVING CHANGES");
    };
  }, [changes]);

  // useEffect(async () => {
  //   await apis.getDateMeals().then((resp) => {
  //     // setActiveDateMeals()
  //     console.log("returned", resp);
  //   });
  // },activeDate);

  return (
    <div className="calendar-content-wrapper">
      <div className="calendar-content-board">
        <div className="calendar-content-board-dates">
          <DateSelector activeDate={activeDate} setActiveDate={setActiveDate} />
        </div>
        <div className="calendar-content-board-planner">
          {/* <button onClick={() => setChanges([])}>Save</button> */}
          {MEAL_TIMES.map((meal, index) => {
            return (
              <div className="calendar-content-board-planner-meal" key={index}>
                <label>{meal.meal_time}</label>
                <MealDrop
                  meal={meal.meal}
                  activeMealClick={activeMealClick}
                  mealClickCallback={handleMealDropClick}
                  index={index}
                  removeMeal={handleMealRemoveClick}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="calendar-content-meal-selection">
        <FilterSelection
          setSearchFilter={setSearchFilter}
          searchFilter={searchFilter}
          setCategoryFilter={setCategoryFilter}
          categoryFilter={categoryFilter}
        />

        <ul className="calendar-content-meal-selection-scroll">
          {meals
            .filter((meal) => {
              if (categoryFilter == "all") {
                return meal.display_name
                  .toLowerCase()
                  .includes(searchFilter.toLowerCase());
              } else {
                return (
                  meal.display_name
                    .toLowerCase()
                    .includes(searchFilter.toLowerCase()) &&
                  meal.category == categoryFilter
                );
              }
            })
            .map((meal, index) => {
              return (
                <div className="selection-scroll-meal-wrapper">
                  <li
                    key={index}
                    className="selection-scroll-meal"
                    onClick={() => handleMealClick(index)}
                  >
                    <div className="calendar-content-meal-header">
                      <div className="calendar-content-meal-displayname">
                        {meal.display_name}
                      </div>
                    </div>
                  </li>
                </div>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
