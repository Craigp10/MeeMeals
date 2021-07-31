import React, { useState, useEffect, useCallback } from "react";
import "./DateSelector.css";
import dayjs from "dayjs";

const DateSelector = (props) => {
  const INITIAL_DATES = [
    {
      date: dayjs(props.activeDate).subtract(3, "days").format("M/D/YYYY"),
      isActive: false,
    },
    {
      date: dayjs(props.activeDate).subtract(2, "days").format("M/D/YYYY"),
      isActive: false,
    },
    {
      date: dayjs(props.activeDate).subtract(1, "days").format("M/D/YYYY"),
      isActive: false,
    },
    { date: dayjs(props.activeDate).format("M/D/YYYY"), isActive: false },
    {
      date: dayjs(props.activeDate).add(1, "days").format("M/D/YYYY"),
      isActive: false,
    },
    {
      date: dayjs(props.activeDate).add(2, "days").format("M/D/YYYY"),
      isActive: false,
    },
    {
      date: dayjs(props.activeDate).add(3, "days").format("M/D/YYYY"),
      isActive: false,
    },
  ];
  const [dates, setDates] = useState(INITIAL_DATES);

  const updateActiveDate = (workingDates, index) => {
    let activeDate = "";
    workingDates.forEach((date, idx) => {
      if (idx != index) {
        date.isActive = false;
      } else {
        date.isActive = true;
        activeDate = date.date;
      }
    });
    console.log(activeDate);
    setDates([...workingDates]);
    props.setActiveDate(activeDate);
  };

  const handleDatesChangeClick = (direction) => {
    const newDates = dates;
    if (direction == "prev") {
      newDates.unshift({
        date: dayjs(newDates[0].date).subtract(1, "days").format("M/D/YYYY"),
        isActive: false,
      });
      newDates.pop();
      updateActiveDate(newDates, 0);
    } else {
      //direction == "next"
      newDates.push({
        date: dayjs(newDates[6].date).add(1, "days").format("M/D/YYYY"),
        isActive: false,
      });
      newDates.shift();
      updateActiveDate(newDates, 6);
    }
  };

  return (
    <div className="date-selector-wrapper">
      <span
        className="glyphicon glyphicon-chevron-left"
        onClick={() => handleDatesChangeClick("prev")}
      ></span>
      {dates.map((date, index) => (
        <span
          key={index}
          className={
            date.date == props.activeDate ? "dates isActive" : "dates notActive"
          }
          onClick={() => updateActiveDate(dates, index)}
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
