import React, { useState, useEffect, FC } from "react";
import "./scss/compiled.scss";
import dayjs from "dayjs";

type dates = {
  date: string;
  isActive: boolean;
};

interface Props {
  activeDate: string; // "M/D/YYYY"
  handleActiveDateChange?: (newActiveDate: string) => void;
  isMobileView: boolean;
}

const DateSelector = (props: Props) => {
  const INITIAL_DATES: dates[] = [
    {
      date: dayjs(props.activeDate).subtract(3, "days").format("M/D/YYYY"), //Subtract 3 days from todays date
      isActive: false,
    },
    {
      date: dayjs(props.activeDate).subtract(2, "days").format("M/D/YYYY"), //Subtract 2 days from todays date
      isActive: false,
    },
    {
      date: dayjs(props.activeDate).subtract(1, "days").format("M/D/YYYY"), //Subtract 1 days from todays date
      isActive: false,
    },
    { date: dayjs(props.activeDate).format("M/D/YYYY"), isActive: false },
    {
      date: dayjs(props.activeDate).add(1, "days").format("M/D/YYYY"), //Add 1 days from todays date
      isActive: false,
    },
    {
      date: dayjs(props.activeDate).add(2, "days").format("M/D/YYYY"), //Add 2 days from todays date
      isActive: false,
    },
    {
      date: dayjs(props.activeDate).add(3, "days").format("M/D/YYYY"), //Add 3 days from todays date
      isActive: false,
    },
  ];
  const [dates, setDates] = useState(INITIAL_DATES);

  const updateActiveDate = (workingDates: dates[], index: number) => {
    //Update dates array and sets activeDate state in parent (Calendar) component.
    let activeDate = "";
    workingDates.forEach((date: dates, idx: number) => {
      if (idx != index) {
        date.isActive = false;
      } else {
        date.isActive = true;
        activeDate = date.date;
      }
    });
    setDates([...workingDates]);
    props.handleActiveDateChange(activeDate);
  };

  const handleDatesChangeDesktop = (direction: string) => {
    //Used in desktop view to that date selector changes dates by week end/beginning
    const newDates = dates;
    if (direction == "prev") {
      //Remove last day in array and add new day at beginning, day before first day in array
      newDates.unshift({
        date: dayjs(newDates[0].date).subtract(1, "days").format("M/D/YYYY"),
        isActive: false,
      });
      newDates.pop();
      updateActiveDate(newDates, 0);
    } else {
      //direction == "next" ... Remove first day element of array and push new ending day, next day on calendar from last day in array
      newDates.push({
        date: dayjs(newDates[6].date).add(1, "days").format("M/D/YYYY"),
        isActive: false,
      });
      newDates.shift();
      updateActiveDate(newDates, 6);
    }
  };

  const handleDatesChangeMobile = (direction: string) => {
    //Used in mobile views so the date selector scrolls dates one date at a time
    const newDates = dates;
    const activeDateIndex = dates.findIndex(
      (elem) => props.activeDate == elem.date
    );
    if (direction == "prev") {
      //Remove last day in array and add new day at beginning, day before first day in array
      newDates.unshift({
        date: dayjs(newDates[0].date).subtract(1, "days").format("M/D/YYYY"),
        isActive: false,
      });
      newDates.pop();
    } else {
      //direction == "next" ... Remove first day element of array and push new ending day, next day on calendar from last day in array
      newDates.push({
        date: dayjs(newDates[6].date).add(1, "days").format("M/D/YYYY"),
        isActive: false,
      });
      newDates.shift();
    }
    updateActiveDate(newDates, activeDateIndex);
  };

  console.log(dates);
  return (
    <>
      {props.isMobileView ? (
        <div className="date-selector-wrapper">
          <span
            className="glyphicon glyphicon-chevron-left"
            onClick={() => handleDatesChangeMobile("prev")}
          ></span>
          {dates
            .filter((date, index) => date.date == props.activeDate)
            .map((date, index) => (
              <span
                key={index}
                className="dates isActive"
                onClick={() => updateActiveDate(dates, index)}
              >
                {date.date}
              </span>
            ))}
          <span
            className="glyphicon glyphicon-chevron-right"
            onClick={() => handleDatesChangeMobile("next")}
          ></span>
        </div>
      ) : (
        <div className="date-selector-wrapper">
          <span
            className="glyphicon glyphicon-chevron-left"
            onClick={() => handleDatesChangeDesktop("prev")}
          ></span>
          {dates.map((date, index) => (
            <span
              key={index}
              className={
                date.date == props.activeDate
                  ? "dates isActive"
                  : "dates notActive"
              }
              onClick={() => updateActiveDate(dates, index)}
            >
              {date.date}
            </span>
          ))}
          <span
            className="glyphicon glyphicon-chevron-right"
            onClick={() => handleDatesChangeDesktop("next")}
          ></span>
        </div>
      )}
    </>
  );
};

export default DateSelector;
