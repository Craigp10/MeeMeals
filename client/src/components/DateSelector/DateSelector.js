import React, { useState, useEffect, useCallback } from "react";
import "./DateSelector.css";

const tmp_date = [
  { date: "7/8/2021", isActive: false },
  { date: "7/9/2021", isActive: false },
  { date: "7/10/2021", isActive: false },
  { date: "7/11/2021", isActive: false },
  { date: "7/12/2021", isActive: false },
  { date: "7/13/2021", isActive: false },
  { date: "7/14/2021", isActive: true },
];

const DateSelector = (props) => {
  const [dates, setDates] = useState(tmp_date);

  const updateActiveDate = (e, index) => {
    const updatedDates = dates;
    let activeDate = {};
    updatedDates.forEach((date, idx) => {
      if (idx != index) {
        date.isActive = false;
      } else {
        date.isActive = true;
        activeDate = date;
      }
    });
    setDates([...updatedDates]);
    console.log("activeDate", activeDate);
    props.setActiveDate(activeDate);
  };

  return (
    <div className="date-selector-wrapper">
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
  );
};

export default DateSelector;
