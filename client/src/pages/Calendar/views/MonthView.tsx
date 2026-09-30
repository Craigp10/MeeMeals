import React, { useState } from "react";
import { Dayjs } from "dayjs";
import {
  PlannerProps,
  SLOT_IDS,
  SlotId,
  dateKey,
  hasDragPayload,
  isSlotId,
  longDate,
  mealsInDay,
  readDragPayload,
  weekOf,
} from "../planner";
import { categoryClass } from "../../../components/MealSlot/MealSlot";

/*
 * A month has no slots to aim at, so a meal dropped or placed on a day goes
 * into the slot named by its category, or the day's first open slot when the
 * category isn't a meal time. A full day opens in Day view instead.
 */
const MonthView = (props: PlannerProps) => {
  const [overKey, setOverKey] = useState("");
  const todayKey = dateKey(props.today);
  const month = props.anchor.month();

  const targetSlot = (mealId: string, key: string): SlotId | undefined => {
    const category = props.mealsById[mealId]?.category ?? "";
    if (isSlotId(category)) return category;
    return SLOT_IDS.find((slot) => !props.schedule[key]?.[slot]);
  };

  const placeOn = (date: Dayjs, mealId: string) => {
    const key = dateKey(date);
    const slot = targetSlot(mealId, key);
    if (slot) props.onPlace({ date: key, slot }, mealId);
    else props.onOpenDay(date);
  };

  return (
    <section aria-label="Month overview" className="month-view">
      <div className="month-view__weekdays">
        {weekOf(props.anchor).map((date) => (
          <abbr key={date.day()} title={date.format("dddd")}>
            {date.format("ddd")}
          </abbr>
        ))}
      </div>
      <div className="month-view__grid">
        {props.dates.map((date) => {
          const key = dateKey(date);
          const ids = mealsInDay(props.schedule[key]).filter(
            (id) => props.mealsById[id]
          );
          const names = ids.map((id) => props.mealsById[id].display_name);
          const isToday = key === todayKey;
          const cellClass = [
            "month-view__cell",
            date.month() === month ? "" : "month-view__cell--outside",
            isToday ? "month-view__cell--today" : "",
            props.pickedMeal ? "month-view__cell--placing" : "",
            overKey === key ? "month-view__cell--over" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={key}
              className={cellClass}
              onDragOver={(event) => {
                if (!hasDragPayload(event)) return;
                event.preventDefault();
                if (overKey !== key) setOverKey(key);
              }}
              onDragLeave={(event) => {
                if (event.currentTarget.contains(event.relatedTarget as Node))
                  return;
                setOverKey("");
              }}
              onDrop={(event) => {
                event.preventDefault();
                setOverKey("");
                const payload = readDragPayload(event);
                if (!payload) return;
                const slot = targetSlot(payload.mealId, key);
                if (payload.from && slot) props.onMove(payload.from, { date: key, slot });
                else placeOn(date, payload.mealId);
              }}
            >
              <button
                type="button"
                aria-label={
                  props.pickedMeal
                    ? "Place " + props.pickedMeal.display_name + " on " + longDate(date)
                    : longDate(date) +
                      (isToday ? ", today" : "") +
                      ": " +
                      (names.length ? names.join(", ") : "nothing planned") +
                      ". Open day view."
                }
                onClick={() =>
                  props.pickedMeal
                    ? placeOn(date, props.pickedMeal._id)
                    : props.onOpenDay(date)
                }
              >
                <span className="month-view__head">
                  <span className="month-view__num">{date.format("D")}</span>
                  <span className="month-view__count">
                    {ids.length
                      ? ids.length === 1
                        ? "1 meal"
                        : ids.length + " meals"
                      : ""}
                  </span>
                </span>
                {ids.slice(0, 3).map((id, index) => {
                  const meal = props.mealsById[id];
                  return (
                    <span
                      key={index}
                      className={"month-view__item " + categoryClass(meal.category)}
                    >
                      <span className="month-view__initial">
                        {meal.category.charAt(0).toUpperCase()}
                      </span>{" "}
                      {meal.display_name}
                    </span>
                  );
                })}
                {ids.length > 3 ? (
                  <span className="month-view__more">+{ids.length - 3} more</span>
                ) : null}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MonthView;
