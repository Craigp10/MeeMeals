import React from "react";
import { Dayjs } from "dayjs";
import "./scss/compiled.scss";
import { dateKey } from "../../pages/Calendar/planner";

interface Props {
  dates: Dayjs[];
  activeDate: Dayjs;
  today: Dayjs;
  isMobileView: boolean;
  onSelect: (date: Dayjs) => void;
  describe?: (date: Dayjs) => string;
}

const DateSelector = (props: Props) => {
  const activeKey = dateKey(props.activeDate);

  if (props.isMobileView) {
    return (
      <div className="date-selector-wrapper">
        <button
          type="button"
          className="date-selector__step"
          aria-label="Previous day"
          onClick={() => props.onSelect(props.activeDate.subtract(1, "day"))}
        >
          <span className="glyphicon glyphicon-chevron-left"></span>
        </button>
        <span className="dates isActive">{activeKey}</span>
        <button
          type="button"
          className="date-selector__step"
          aria-label="Next day"
          onClick={() => props.onSelect(props.activeDate.add(1, "day"))}
        >
          <span className="glyphicon glyphicon-chevron-right"></span>
        </button>
      </div>
    );
  }

  return (
    <nav aria-label="Days this week" className="date-selector-wrapper">
      {props.dates.map((date) => {
        const key = dateKey(date);
        const isActive = key === activeKey;
        const isToday = key === dateKey(props.today);
        return (
          <button
            type="button"
            key={key}
            className={"dates " + (isActive ? "isActive" : "notActive")}
            aria-current={isActive ? "date" : undefined}
            aria-label={
              date.format("dddd") +
              " " +
              key +
              (isToday ? ", today" : "") +
              (props.describe ? ", " + props.describe(date) : "")
            }
            onClick={() => props.onSelect(date)}
          >
            <span className="dates__day">{date.format("dddd")}</span>
            <span className="dates__date">{key}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default DateSelector;
