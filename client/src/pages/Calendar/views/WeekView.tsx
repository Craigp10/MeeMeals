import React from "react";
import MealSlot from "../../../components/MealSlot/MealSlot";
import { PlannerProps, SLOTS, dateKey, longDate } from "../planner";

const WeekView = (props: PlannerProps) => {
  const todayKey = dateKey(props.today);

  return (
    <section aria-label="Week plan" className="week-view">
      <div className="week-view__head">
        <span></span>
        {props.dates.map((date) => {
          const key = dateKey(date);
          const isToday = key === todayKey;
          return (
            <button
              type="button"
              key={key}
              className={"week-view__day" + (isToday ? " week-view__day--today" : "")}
              aria-label={"Open " + longDate(date) + (isToday ? ", today" : "")}
              onClick={() => props.onOpenDay(date)}
            >
              <span className="week-view__dow">{date.format("ddd")}</span>
              <span className="week-view__num">{date.format("D")}</span>
            </button>
          );
        })}
      </div>

      {SLOTS.map((slot, row) => {
        const filled = props.dates.filter(
          (date) => props.schedule[dateKey(date)]?.[slot.id]
        ).length;
        return (
          <div
            role="group"
            aria-label={slot.label}
            className="week-view__row"
            key={slot.id}
          >
            <div className="week-view__row-label">
              <span>{slot.label}</span>
              <span>{filled} of 7 days</span>
            </div>
            {props.dates.map((date, column) => {
              const key = dateKey(date);
              const mealId = props.schedule[key]?.[slot.id];
              const at = { date: key, slot: slot.id };
              return (
                <MealSlot
                  key={key}
                  variant="compact"
                  date={key}
                  dateLabel={longDate(date)}
                  slot={slot.id}
                  meal={mealId ? props.mealsById[mealId] : undefined}
                  meals={props.meals}
                  pickedMeal={props.pickedMeal}
                  isToday={key === todayKey}
                  menuAbove={row >= 2}
                  menuAlignRight={column >= 4}
                  onPlace={(mealId) => props.onPlace(at, mealId)}
                  onMove={(from) => props.onMove(from, at)}
                  onRemove={() => props.onRemove(at)}
                />
              );
            })}
          </div>
        );
      })}
    </section>
  );
};

export default WeekView;
