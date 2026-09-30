import React, { useState, useEffect, useContext, useMemo } from "react";
import { Dayjs } from "dayjs";
import "./scss/compiled.scss";
import apis from "../../api/index";
import CalendarToolbar from "../../components/CalendarToolbar/CalendarToolbar";
import DateSelector from "../../components/DateSelector/DateSelector";
import MealDrop from "../../components/MealDrop/MealDrop";
import FilterSelection from "../../components/SelectionFilter/SelectionFilter";
import MealSelection, {
  filterMeals,
} from "../../components/MealsSelection/MealsSelection";
import WeekView from "./views/WeekView";
import DayView from "./views/DayView";
import MonthView from "./views/MonthView";
import { userContext, windowSizeContext } from "../../App";
import {
  CalendarView,
  EMPTY_DAY,
  Meal,
  PlannerProps,
  SLOTS,
  Schedule,
  SlotId,
  SlotRef,
  dateKey,
  longDate,
  mealsInDay,
  rangeLabel,
  shiftAnchor,
  today,
  visibleDates,
} from "./planner";

interface User {
  id: string;
  username: string;
  email: string;
}

type PulledDay = Partial<Record<SlotId, string>> & {
  day: string;
  pulled: boolean;
};

type SlotChange = SlotRef & { mealId: string };

const EMPTY_MEAL: Meal = {
  category: "",
  date_created: "",
  description: "",
  display_name: "",
  ingredients: [""],
  instructions: [""],
  isActive: false,
  tags: [""],
  _id: "",
};

/*
 * The calendar keeps one Schedule for every date it has loaded, keyed the way
 * the server keys days (M/D/YYYY). Each view reads from it; every change is
 * applied locally first, then the whole day it touched is saved, because the
 * server stores a day's four slots together.
 */
const Calendar = () => {
  const user = useContext<User>(userContext);
  const windowSize = useContext(windowSizeContext);
  const isMobileView = windowSize.width < 768;

  const [view, setView] = useState<CalendarView>("week");
  const [anchor, setAnchor] = useState<Dayjs>(today());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [pickedMealId, setPickedMealId] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [saveFailed, setSaveFailed] = useState<boolean>(false);

  const activeView: CalendarView = isMobileView ? "day" : view;
  const now = today();
  const dates = useMemo(
    () => visibleDates(activeView, anchor),
    [activeView, anchor]
  );
  const rangeKey = dateKey(dates[0]) + "|" + dates.length;
  const mealsById = useMemo(() => {
    const byId: Record<string, Meal> = {};
    meals.forEach((meal) => (byId[meal._id] = meal));
    return byId;
  }, [meals]);
  const pickedMeal = pickedMealId ? mealsById[pickedMealId] : undefined;

  useEffect(() => {
    apis
      .getUserMeals({ user_id: user.id })
      .then((resp) => setMeals(resp.data.meals ?? []))
      .catch((err) => {
        console.log(err);
        setMeals([]);
      });
  }, [user.id]);

  useEffect(() => {
    let current = true;
    apis
      .pullCalendarWeek({ user_id: user.id, week: dates.map(dateKey) })
      .then((resp) => {
        if (!current) return;
        const pulled: Schedule = {};
        (resp.data.meals as PulledDay[]).forEach((day) => {
          pulled[day.day] = {
            breakfast: day.breakfast || "",
            lunch: day.lunch || "",
            dinner: day.dinner || "",
            snack: day.snack || "",
          };
        });
        setSchedule((previous) => ({ ...previous, ...pulled }));
      })
      .catch((err) => {
        console.log(err);
        if (current) setStatus("could not load planned meals");
      });
    return () => {
      current = false;
    };
    // rangeKey identifies `dates`, which is rebuilt on every anchor change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeKey, user.id]);

  const where = (ref: SlotRef) => {
    const date = dates.find((candidate) => dateKey(candidate) === ref.date);
    return (date ? longDate(date) : ref.date) + " " + ref.slot;
  };

  const mealName = (mealId: string) =>
    mealsById[mealId]?.display_name ?? "meal";

  const writeSlots = (changes: SlotChange[], message: string) => {
    const next = { ...schedule };
    changes.forEach((change) => {
      next[change.date] = {
        ...(next[change.date] ?? EMPTY_DAY),
        [change.slot]: change.mealId,
      };
    });
    setSchedule(next);
    setStatus(message);

    const touched = Array.from(new Set(changes.map((change) => change.date)));
    touched.forEach((date) =>
      apis
        .saveCalendarChanges({ date, user_id: user.id, changes: next[date] })
        .then(() => setSaveFailed(false))
        .catch((err) => {
          console.log(err);
          setSaveFailed(true);
        })
    );
  };

  const placeMeal = (to: SlotRef, mealId: string) => {
    setPickedMealId("");
    const current = schedule[to.date]?.[to.slot] ?? "";
    if (current === mealId) {
      setStatus(mealName(mealId) + " is already planned for " + where(to));
      return;
    }
    writeSlots(
      [{ ...to, mealId }],
      current && mealsById[current]
        ? "replaced " + mealName(current) + " with " + mealName(mealId) + " in " + where(to)
        : "added " + mealName(mealId) + " to " + where(to)
    );
  };

  // Moving onto a filled slot swaps the two meals, so nothing is lost.
  const moveMeal = (from: SlotRef, to: SlotRef) => {
    if (from.date === to.date && from.slot === to.slot) return;
    const mealId = schedule[from.date]?.[from.slot];
    if (!mealId) return;
    const displaced = schedule[to.date]?.[to.slot] ?? "";
    writeSlots(
      [
        { ...from, mealId: displaced },
        { ...to, mealId },
      ],
      "moved " + mealName(mealId) + " to " + where(to)
    );
  };

  const removeMeal = (at: SlotRef) => {
    const mealId = schedule[at.date]?.[at.slot];
    if (!mealId) return;
    writeSlots(
      [{ ...at, mealId: "" }],
      "removed " + mealName(mealId) + " from " + where(at)
    );
  };

  const showDate = (date: Dayjs) => {
    setAnchor(date);
    setStatus("showing " + rangeLabel(activeView, date));
  };

  const openDay = (date: Dayjs) => {
    setView("day");
    setAnchor(date);
    setStatus("showing " + rangeLabel("day", date));
  };

  const pickMeal = (mealId: string) => {
    const deselect = mealId === pickedMealId;
    setPickedMealId(deselect ? "" : mealId);
    setStatus(
      deselect
        ? "placement cancelled"
        : "selected " + mealName(mealId) + "; choose where to place it"
    );
  };

  const plannerProps: PlannerProps = {
    dates,
    anchor,
    today: now,
    schedule,
    meals,
    mealsById,
    pickedMeal,
    onPlace: placeMeal,
    onMove: moveMeal,
    onRemove: removeMeal,
    onOpenDay: openDay,
  };

  if (isMobileView) {
    const key = dateKey(anchor);
    return (
      <div className="calendar-wrapper calendar-wrapper--mobile">
        <DateSelector
          dates={dates}
          activeDate={anchor}
          today={now}
          isMobileView={true}
          onSelect={showDate}
        />
        <div className="calendar__planner-content">
          {SLOTS.map((slot, index) => {
            const mealId = schedule[key]?.[slot.id];
            const at = { date: key, slot: slot.id };
            return (
              <div className="calendar__planner-meal" key={slot.id}>
                <label>{slot.label}</label>
                <div className="calendar__planner__meal-mealdrop">
                  <MealDrop
                    meals={meals}
                    meal={(mealId && mealsById[mealId]) || EMPTY_MEAL}
                    activeMealIsActive={!!pickedMeal}
                    mealClickCallback={() => placeMeal(at, pickedMealId)}
                    index={index}
                    removeMeal={() => removeMeal(at)}
                    handleMealDropSelect={(id: string) => placeMeal(at, id)}
                    isMobileView={true}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const visibleMeals = filterMeals(meals, categoryFilter, searchFilter);
  let progressLabel: string;
  let progress: number;
  if (activeView === "month") {
    const inMonth = dates.filter((date) => date.month() === anchor.month());
    const planned = inMonth.reduce(
      (sum, date) => sum + mealsInDay(schedule[dateKey(date)]).length,
      0
    );
    const daysPlanned = inMonth.filter(
      (date) => mealsInDay(schedule[dateKey(date)]).length > 0
    ).length;
    progressLabel = planned + " meals planned in " + anchor.format("MMMM");
    progress = daysPlanned / inMonth.length;
  } else {
    const days = activeView === "day" ? [anchor] : dates;
    const total = days.length * SLOTS.length;
    const filled = days.reduce(
      (sum, date) => sum + mealsInDay(schedule[dateKey(date)]).length,
      0
    );
    progressLabel = filled + " of " + total + " slots planned";
    progress = filled / total;
  }

  return (
    <div className="calendar-wrapper">
      <aside aria-labelledby="calendar-meals-heading" className="calendar__meals">
        <div className="calendar__meals-heading">
          <h2 id="calendar-meals-heading">My meals</h2>
          <span>
            {visibleMeals.length} of {meals.length}
          </span>
        </div>
        <p id="calendar-meals-hint" className="calendar__meals-hint">
          Drag a meal onto the calendar, or select it and choose a slot.
        </p>
        <FilterSelection
          setSearchFilter={setSearchFilter}
          searchFilter={searchFilter}
          setCategoryFilter={setCategoryFilter}
          categoryFilter={categoryFilter}
        />
        <MealSelection
          meals={meals}
          pickedMealId={pickedMealId}
          handleMealClick={pickMeal}
          categoryFilter={categoryFilter}
          searchFilter={searchFilter}
          describedBy="calendar-meals-hint"
        />
      </aside>

      <div className="calendar__main">
        <CalendarToolbar
          title={rangeLabel(activeView, anchor)}
          view={activeView}
          showViewSwitch={true}
          onPrev={() => showDate(shiftAnchor(activeView, anchor, -1))}
          onToday={() => showDate(now)}
          onNext={() => showDate(shiftAnchor(activeView, anchor, 1))}
          onViewChange={(next) => {
            setView(next);
            setStatus(next + " view, showing " + rangeLabel(next, anchor));
          }}
        />

        <div className="calendar__content">
          {pickedMeal ? (
            <div className="calendar__placing">
              <span>
                Placing <strong>{pickedMeal.display_name}</strong>.{" "}
                {activeView === "month"
                  ? "Choose a day; it goes in the " + pickedMeal.category + " slot."
                  : "Choose any slot marked Place Here."}
              </span>
              <button type="button" onClick={() => pickMeal(pickedMealId)}>
                Cancel
              </button>
            </div>
          ) : null}

          {activeView === "week" ? <WeekView {...plannerProps} /> : null}
          {activeView === "day" ? <DayView {...plannerProps} /> : null}
          {activeView === "month" ? <MonthView {...plannerProps} /> : null}

          <div className="calendar__footer">
            <p role="status" aria-live="polite" className="calendar__status">
              {saveFailed ? "Error saving changes" : status}
            </p>
            <span aria-hidden="true" className="calendar__progress">
              <span style={{ width: Math.round(progress * 100) + "%" }}></span>
            </span>
            <span className="calendar__progress-label">{progressLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
