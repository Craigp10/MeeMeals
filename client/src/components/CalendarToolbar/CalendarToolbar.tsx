import React from "react";
import { CalendarView } from "../../pages/Calendar/planner";
import "./CalendarToolbar.scss";

const VIEWS: { id: CalendarView; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

interface Props {
  title: string;
  view: CalendarView;
  showViewSwitch: boolean;
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarView) => void;
}

const Chevron = ({ d }: { d: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const CalendarToolbar = (props: Props) => (
  <div className="calendar-toolbar">
    <div className="calendar-toolbar__title">
      <span>Meal plan</span>
      <h1>{props.title}</h1>
    </div>
    <div className="calendar-toolbar__nav">
      <button
        type="button"
        className="calendar-toolbar__icon"
        aria-label={"Previous " + props.view}
        onClick={props.onPrev}
      >
        <Chevron d="M15 18l-6-6 6-6" />
      </button>
      <button type="button" onClick={props.onToday}>
        Today
      </button>
      <button
        type="button"
        className="calendar-toolbar__icon"
        aria-label={"Next " + props.view}
        onClick={props.onNext}
      >
        <Chevron d="M9 18l6-6-6-6" />
      </button>
    </div>
    {props.showViewSwitch ? (
      <div
        role="group"
        aria-label="Calendar view"
        className="calendar-toolbar__views"
      >
        {VIEWS.map((view) => (
          <button
            type="button"
            key={view.id}
            aria-pressed={props.view === view.id}
            onClick={() => props.onViewChange(view.id)}
          >
            {view.label}
          </button>
        ))}
      </div>
    ) : null}
  </div>
);

export default CalendarToolbar;
