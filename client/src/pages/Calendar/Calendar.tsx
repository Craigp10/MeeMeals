import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { Dayjs } from "dayjs";
import "./scss/compiled.scss";
import apis from "../../api/index";
import CalendarToolbar, {
  MEALS_TOGGLE_ID,
} from "../../components/CalendarToolbar/CalendarToolbar";
import FilterSelection from "../../components/SelectionFilter/SelectionFilter";
import MealSelection, {
  filterMeals,
} from "../../components/MealsSelection/MealsSelection";
import WeekView from "./views/WeekView";
import WeekListView from "./views/WeekListView";
import DayView from "./views/DayView";
import MonthView from "./views/MonthView";
import { userContext, windowSizeContext } from "../../App";
import {
  CalendarView,
  EMPTY_DAY,
  Meal,
  Layout,
  PlannerProps,
  SLOTS,
  Schedule,
  SlotId,
  SlotRef,
  dateKey,
  layoutFor,
  longDate,
  mealsInDay,
  rangeLabel,
  shiftAnchor,
  shortRangeLabel,
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

/*
 * The calendar keeps one Schedule for every date it has loaded, keyed the way
 * the server keys days (M/D/YYYY). Each view reads from it; every change is
 * applied locally first, then the whole day it touched is saved, because the
 * server stores a day's four slots together.
 */
const Calendar = () => {
  const user = useContext<User>(userContext);
  const windowSize = useContext(windowSizeContext);
  const layout: Layout = layoutFor(windowSize.width);
  const panelIsOverlay = layout !== "desktop";

  const [view, setView] = useState<CalendarView>(() =>
    layoutFor(windowSize.width) === "phone" ? "day" : "week"
  );
  const [mealsOpen, setMealsOpen] = useState<boolean>(false);
  const closeMealsButton = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState<Dayjs>(today());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [pickedMealId, setPickedMealId] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [saveFailed, setSaveFailed] = useState<boolean>(false);

  const activeView: CalendarView = view;
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

  const showMeals = panelIsOverlay ? mealsOpen : true;
  const wasOpen = useRef(false);
  useEffect(() => {
    if (!panelIsOverlay) return;
    if (mealsOpen) closeMealsButton.current?.focus();
    else if (wasOpen.current) document.getElementById(MEALS_TOGGLE_ID)?.focus();
    wasOpen.current = mealsOpen;
  }, [mealsOpen, panelIsOverlay]);

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
    // On narrow screens the panel covers the calendar, so get it out of the way.
    if (!deselect && panelIsOverlay) setMealsOpen(false);
    setStatus(
      deselect
        ? "placement cancelled"
        : "selected " + mealName(mealId) + "; choose where to place it"
    );
  };

  const plannerProps: PlannerProps = {
    layout,
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
    <div className={"calendar-wrapper calendar-wrapper--" + layout}>
      {panelIsOverlay && mealsOpen ? (
        <div
          className="calendar__backdrop"
          aria-hidden="true"
          onClick={() => setMealsOpen(false)}
        ></div>
      ) : null}
      {showMeals ? (
      <aside
        id="calendar-meals"
        aria-labelledby="calendar-meals-heading"
        role={panelIsOverlay ? "dialog" : undefined}
        aria-modal={panelIsOverlay ? true : undefined}
        className={
          "calendar__meals" +
          (panelIsOverlay ? " calendar__meals--overlay calendar__meals--" + layout : "")
        }
        onKeyDown={(event) => {
          if (panelIsOverlay && event.key === "Escape") setMealsOpen(false);
        }}
      >
        <div className="calendar__meals-heading">
          <h2 id="calendar-meals-heading">My meals</h2>
          <span>
            {visibleMeals.length} of {meals.length}
          </span>
          {panelIsOverlay ? (
            <button
              type="button"
              ref={closeMealsButton}
              className="calendar__meals-close"
              aria-label="Close meals"
              onClick={() => setMealsOpen(false)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
        <p id="calendar-meals-hint" className="calendar__meals-hint">
          {layout === "phone"
            ? "Tap a meal, then choose a slot marked Place Here."
            : "Drag a meal onto the calendar, or select it and choose a slot."}
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
      ) : null}

      <div className="calendar__main">
        <CalendarToolbar
          title={
            panelIsOverlay
              ? shortRangeLabel(activeView, anchor)
              : rangeLabel(activeView, anchor)
          }
          view={activeView}
          layout={layout}
          mealsOpen={mealsOpen}
          onToggleMeals={panelIsOverlay ? () => setMealsOpen(!mealsOpen) : undefined}
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

          {activeView === "week" ? (
            layout === "phone" ? (
              <WeekListView {...plannerProps} />
            ) : (
              <WeekView {...plannerProps} />
            )
          ) : null}
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
