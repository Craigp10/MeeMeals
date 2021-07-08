import React, { useState, useEffect } from "react";
import "./Calendar.css";

const tmp_date = [
  { date: "7/8/2021", isActive: false },
  { date: "7/9/2021", isActive: false },
  { date: "7/10/2021", isActive: false },
  { date: "7/11/2021", isActive: false },
  { date: "7/12/2021", isActive: false },
  { date: "7/13/2021", isActive: false },
  { date: "7/14/2021", isActive: true },
];

const Calendar = (props) => {
  const [dates, setDates] = useState(tmp_date);

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
  console.log(dates);
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
          <div className="calendar-content-board-planner-meal"></div>
        </div>
      </div>
      <div className="calendar-content-meal-selection">
        <div className="calendar-content-meal-selection-filter">a</div>
        <div className="calendar-content-meal-selection-scroll"></div>
      </div>
    </div>
  );
};

export default Calendar;
