import React from "react";
import MealSlot from "../../../components/MealSlot/MealSlot";
import { PlannerProps, SLOTS, dateKey, longDate, mealsInDay } from "../planner";

// Phones: the week as a list of days, each with its four meal times.
const WeekListView = (props: PlannerProps) => {
  const todayKey = dateKey(props.today);

  return (
    <section aria-label="Week plan" className="week-list">
      {props.dates.map((date) => {
        const key = dateKey(date);
        const isToday = key === todayKey;
        const planned = mealsInDay(props.schedule[key]).length;
        const headingId = "week-list-" + date.format("YYYY-MM-DD");
        return (
          <section
            key={key}
            aria-labelledby={headingId}
            className={"week-list__day" + (isToday ? " week-list__day--today" : "")}
          >
            <h2 id={headingId} className="week-list__heading">
              <button
                type="button"
                aria-label={"Open " + longDate(date) + (isToday ? ", today" : "")}
                onClick={() => props.onOpenDay(date)}
              >
                <span className="week-list__dow">{date.format("dddd")}</span>
                <span className="week-list__date">{key}</span>
                {isToday ? <span className="week-list__today">Today</span> : null}
              </button>
              <span className="week-list__count">{planned} of 4</span>
            </h2>
            <div className="week-list__slots">
              {SLOTS.map((slot, index) => {
                const mealId = props.schedule[key]?.[slot.id];
                const at = { date: key, slot: slot.id };
                return (
                  <div className="week-list__slot" key={slot.id}>
                    <span className="week-list__slot-label">{slot.label}</span>
                    <MealSlot
                      variant="compact"
                      date={key}
                      dateLabel={longDate(date)}
                      slot={slot.id}
                      meal={mealId ? props.mealsById[mealId] : undefined}
                      meals={props.meals}
                      pickedMeal={props.pickedMeal}
                      isToday={isToday}
                      menuAsSheet={true}
                      menuAlignRight={index % 2 === 1}
                      onPlace={(id) => props.onPlace(at, id)}
                      onMove={(from) => props.onMove(from, at)}
                      onRemove={() => props.onRemove(at)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </section>
  );
};

export default WeekListView;
