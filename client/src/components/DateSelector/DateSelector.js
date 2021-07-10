import React, { useState, useEffect, useCallback } from "react";
import "./DateSelector.css";

const tmp_date = [
  { date: "7/8/2021", isActive: false },
  { date: "7/9/2021", isActive: false },
  { date: "7/10/2021", isActive: false },
  { date: "7/11/2021", isActive: false },
  { date: "7/12/2021", isActive: false },
  { date: "7/13/2021", isActive: false },
  { date: "7/14/2021", isActive: false },
];

const DateSelector = (props) => {
  const [dates, setDates] = useState(tmp_date);

  const updateActiveDate = (e, index) => {
    const updatedDates = dates;
    let activeDate = "";
    updatedDates.forEach((date, idx) => {
      if (idx != index) {
        date.isActive = false;
      } else {
        date.isActive = true;
        activeDate = date.date;
      }
    });
    setDates([...updatedDates]);
    props.setActiveDate(activeDate);
  };

  const handleDatesChangeClick = (direction) => {
    //Logic to determine the new date, remove the opposite old date and append the new date in the correct spot.
    //Set state dates array, should trigger the useEffect hook.
  };

  useEffect(() => {
    console.log("useEffect triggered");
    const dateAdded = {
      date: "",
      isActive: true,
    };

    props.setActiveDate(dateAdded.date);
  }, dates);

  return (
    <div className="date-selector-wrapper">
      <span
        className="glyphicon glyphicon-chevron-left"
        onClick={() => handleDatesChangeClick("prev")}
      ></span>
      {dates.map((date, index) => (
        <span
          className={date.date == props.activeDate ? "isActive" : "notActive"}
          onClick={(e) => updateActiveDate(e, index)}
        >
          {date.date}
        </span>
      ))}
      <span
        className="glyphicon glyphicon-chevron-right"
        onClick={() => handleDatesChangeClick("next")}
      ></span>
    </div>
  );
};

export default DateSelector;
