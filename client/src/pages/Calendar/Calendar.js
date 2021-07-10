import React, { useState, useEffect, useCallback } from "react";
import "./Calendar.css";
import apis from "../../api/meals";
import MealDrop from "../../components/MealDrop/MealDrop";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const tmp_date = [
  { date: "7/8/2021", isActive: false },
  { date: "7/9/2021", isActive: false },
  { date: "7/10/2021", isActive: false },
  { date: "7/11/2021", isActive: false },
  { date: "7/12/2021", isActive: false },
  { date: "7/13/2021", isActive: false },
  { date: "7/14/2021", isActive: true },
];

const MEAL_TIMES = [
  { meal_time: "Breakfast", meal: {} },
  { meal_time: "Lunch", meal: {} },
  { meal_time: "Dinner", meal: {} },
  { meal_time: "Snack", meal: {} },
];

const Calendar = (props) => {
  const [dates, setDates] = useState(tmp_date);
  const [meals, setMeals] = useState([]);
  const [activeWeek, setActiveWeek] = useState(""); //# of week of year using momentJS...
  const [categoryFilters, setCategoryFilters] = useState([]); //Probably make filtering its own component
  const [searchFilter, setSearchFilter] = useState(""); //Probably make filtering its own component
  const [activeMealClick, setActiveMealClick] = useState(false);
  const [activeMeal, setActiveMeal] = useState({});

  const updateActiveDate = (e, index) => {
    const updatedDates = dates;
    updatedDates.forEach((date, idx) => {
      if (idx != index) {
        date.isActive = false;
      } else {
        date.isActive = true;
      }
    });
    setDates([...updatedDates]);
  };

  // const handleFilterChange = (e) => { //implement filter logic later
  //   console.log(e);
  // };

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
  }, []);

  console.log(activeMeal, activeMealClick);
  console.log(MEAL_TIMES);

  return (
    <div className="calendar-content-wrapper">
      <div className="calendar-content-board">
        <div className="calendar-content-board-dates">
          <span className="glyphicon glyphicon-chevron-left"></span>
          {dates.map((date, index) => (
            <span
              className={date.isActive ? "isActive" : "notActive"}
              onClick={(e) => updateActiveDate(e, index)}
            >
              {date.date}
            </span>
          ))}
          <span className="glyphicon glyphicon-chevron-right"></span>
        </div>
        <div className="calendar-content-board-planner">
          {MEAL_TIMES.map((meal, index) => {
            return (
              <div className="calendar-content-board-planner-meal">
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
            // return (
            //     <label>{meal.meal_time}</label>
            //     <div
            //       className={
            //         activeMealClick
            //           ? "calendar-content-board-planner-meal-drop active"
            //           : "calendar-content-board-planner-meal-drop"
            //       }
            //       onClick={() => handleMealDropClick(index)}
            //     >
            //       {meal?.meal?.display_name}
            //     </div>
            //   </div>
            // );
          })}
        </div>
      </div>
      <div className="calendar-content-meal-selection">
        <div className="calendar-content-meal-selection-filter">
          <span className="filterBtn" id="all">
            All
          </span>
          <span className="filterBtn" id="breakfast">
            Breakfast
          </span>
          <span className="filterBtn" id="lunch">
            Lunch
          </span>
          <span className="filterBtn" id="dinner">
            Dinner
          </span>
          <span className="filterBtn" id="snack">
            Snack
          </span>
          <span className="glyphicon glyphicon-search">
            <input
              id="search"
              value={searchFilter}
              placeholder="Search for meals"
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </span>
        </div>
        <ul className="calendar-content-meal-selection-scroll">
          {meals
            .filter((meal) =>
              meal.display_name
                .toLowerCase()
                .includes(searchFilter.toLowerCase())
            )
            .map((meal, index) => {
              return (
                <li
                  key={index}
                  className="selection-scroll-meal"
                  onClick={() => handleMealClick(index)}
                >
                  {meal.display_name}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
