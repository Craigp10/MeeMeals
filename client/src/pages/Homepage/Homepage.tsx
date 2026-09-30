import React, { useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./scss/compiled.scss";
import apis from "../../api/index";
import { userContext } from "../../App";
import { Meal, activeMeals, categoryLabel } from "../../types/meal";
import { categoryClass } from "../../components/MealSlot/MealSlot";
import {
  EMPTY_DAY,
  SLOTS,
  Schedule,
  SlotId,
  dateKey,
  mealsInDay,
  today as startOfToday,
  weekOf,
} from "../Calendar/planner";

interface User {
  id: string;
  username: string;
  email: string;
}

type PulledDay = Partial<Record<SlotId, string>> & { day: string };

const RECENT_COUNT = 3;

// Opens the meal in the Meals page's View dialog.
const mealLink = (id: string) => ({ pathname: "/meals", state: { mealPreview: id } });

/*
 * A read-only overview: today's four meal times, this week at a glance,
 * tomorrow, how much of the week is planned and the newest meals. Planning
 * itself happens on the calendar, which every "plan" action links to.
 */
const Home = () => {
  const user = useContext<User>(userContext);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({});

  const now = startOfToday();
  const todayKey = dateKey(now);
  const tomorrow = now.add(1, "day");
  const week = useMemo(() => weekOf(startOfToday()), []);
  // On Sundays tomorrow falls in next week, so ask for it as well.
  const requested = useMemo(() => {
    const keys = week.map(dateKey);
    const tomorrowKey = dateKey(startOfToday().add(1, "day"));
    return keys.includes(tomorrowKey) ? keys : keys.concat([tomorrowKey]);
  }, [week]);

  useEffect(() => {
    apis
      .getUserMeals({ user_id: user.id })
      .then((resp) => setMeals(activeMeals(resp.data.meals)))
      .catch((err) => console.log(err));
    apis
      .pullCalendarWeek({ user_id: user.id, week: requested })
      .then((resp) => {
        const pulled: Schedule = {};
        (resp.data.meals as PulledDay[]).forEach((day) => {
          pulled[day.day] = {
            breakfast: day.breakfast || "",
            lunch: day.lunch || "",
            dinner: day.dinner || "",
            snack: day.snack || "",
          };
        });
        setSchedule(pulled);
      })
      .catch((err) => console.log(err));
  }, [user.id, requested]);

  const mealsById = useMemo(() => {
    const byId: Record<string, Meal> = {};
    meals.forEach((meal) => (byId[meal._id] = meal));
    return byId;
  }, [meals]);

  // Only count slots whose meal still exists; deleted meals leave stale ids.
  const mealAt = (key: string, slot: SlotId) => {
    const id = (schedule[key] ?? EMPTY_DAY)[slot];
    return id ? mealsById[id] : undefined;
  };
  const plannedOn = (key: string) =>
    mealsInDay(schedule[key]).filter((id) => mealsById[id]).length;

  const todayPlanned = plannedOn(todayKey);
  const weekPlanned = week.reduce((sum, date) => sum + plannedOn(dateKey(date)), 0);
  const weekTotal = week.length * SLOTS.length;
  const openDays = week.filter((date) => plannedOn(dateKey(date)) === 0);
  const recent = meals
    .slice()
    .sort((a, b) => Date.parse(b.date_created) - Date.parse(a.date_created))
    .slice(0, RECENT_COUNT);

  return (
    <div className="home-wrapper scroll-on-hover">
      <header className="home__header">
        <div className="home__heading">
          <span>{now.format("dddd") + ", " + todayKey}</span>
          <h1>
            {todayPlanned === SLOTS.length
              ? "Every meal is planned today"
              : todayPlanned + " of " + SLOTS.length + " meals planned today"}
          </h1>
        </div>
        <div className="home__actions">
          <Link to="/meals" className="home__button">
            My meals
          </Link>
          <Link to="/calendar" className="home__button home__button--primary">
            Plan this week
          </Link>
        </div>
      </header>

      <div className="home__layout">
        <div className="home__main">
          <section aria-labelledby="home-today" className="home__section">
            <div className="home__section-heading">
              <h2 id="home-today">Today</h2>
              <span>
                {todayPlanned} of {SLOTS.length} planned
              </span>
            </div>
            <ul className="home__today">
              {SLOTS.map((slot) => {
                const meal = mealAt(todayKey, slot.id);
                return (
                  <li
                    key={slot.id}
                    className={
                      "home__tile " +
                      (meal ? categoryClass(slot.id) : "home__tile--empty")
                    }
                  >
                    <span className="home__tile-band">{slot.label}</span>
                    {meal ? (
                      <div className="home__tile-body">
                        <Link to={mealLink(meal._id)} className="home__tile-name">
                          {meal.display_name}
                        </Link>
                        {meal.description ? <p>{meal.description}</p> : null}
                      </div>
                    ) : (
                      <div className="home__tile-body home__tile-body--empty">
                        <p>Nothing planned.</p>
                        <Link to="/calendar" className="home__plan">
                          Plan {slot.id}
                        </Link>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="home-week" className="home__section home__section--grow">
            <div className="home__section-heading">
              <h2 id="home-week">This week</h2>
              <span className="home__grow">
                {week[0].format("M/D")} – {week[6].format("M/D")}
              </span>
              <Link to="/calendar">Open the calendar</Link>
            </div>
            <div className="home__week scroll-on-hover">
              <table className="home__week-table">
                <caption className="home__sr">
                  Meals planned this week, by meal time and day
                </caption>
                <thead>
                  <tr>
                    <td></td>
                    {week.map((date) => {
                      const isToday = dateKey(date) === todayKey;
                      return (
                        <th
                          key={dateKey(date)}
                          scope="col"
                          className={isToday ? "home__week-today" : undefined}
                          aria-current={isToday ? "date" : undefined}
                        >
                          <span>{date.format("ddd")}</span> {date.format("M/D")}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {SLOTS.map((slot) => (
                    <tr key={slot.id}>
                      <th scope="row">{slot.label}</th>
                      {week.map((date) => {
                        const key = dateKey(date);
                        const meal = mealAt(key, slot.id);
                        return (
                          <td
                            key={key}
                            className={
                              (key === todayKey ? "home__cell--today " : "") +
                              (meal ? "" : "home__cell--empty")
                            }
                          >
                            {meal ? (
                              <Link
                                to={mealLink(meal._id)}
                                className={"home__chip " + categoryClass(meal.category)}
                              >
                                {meal.display_name}
                              </Link>
                            ) : (
                              <span className="home__sr">Nothing planned</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="home__side">
          <section aria-labelledby="home-tomorrow" className="home__panel">
            <h2 id="home-tomorrow">Tomorrow</h2>
            <ul className="home__tomorrow">
              {SLOTS.map((slot) => {
                const meal = mealAt(dateKey(tomorrow), slot.id);
                return (
                  <li key={slot.id} className={categoryClass(slot.id)}>
                    <span className="home__tomorrow-slot">{slot.label}</span>
                    {meal ? (
                      <Link to={mealLink(meal._id)}>{meal.display_name}</Link>
                    ) : (
                      <span className="home__muted">Nothing planned</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="home-progress" className="home__panel">
            <h2 id="home-progress">Week planned</h2>
            <p className="home__progress-count">
              <strong>{weekPlanned}</strong> of {weekTotal} meal times
            </p>
            <span aria-hidden="true" className="home__progress">
              <span style={{ width: Math.round((weekPlanned / weekTotal) * 100) + "%" }}></span>
            </span>
            <p className="home__muted">
              {openDays.length
                ? "Nothing planned yet on " +
                  openDays.map((date) => date.format("ddd")).join(", ") +
                  "."
                : "Every day has at least one meal."}
            </p>
          </section>

          <section aria-labelledby="home-recent" className="home__panel">
            <div className="home__panel-heading">
              <h2 id="home-recent">Recently added</h2>
              <Link to="/meals">All meals</Link>
            </div>
            {recent.length ? (
              <ul className="home__recent">
                {recent.map((meal) => (
                  <li key={meal._id} className={categoryClass(meal.category)}>
                    <span aria-hidden="true" className="home__dot"></span>
                    <Link to={mealLink(meal._id)}>{meal.display_name}</Link>
                    <span className="home__muted">
                      {categoryLabel(meal.category)} · {meal.date_created}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="home__muted">
                No meals yet. <Link to="/meals">Create your first meal</Link>.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Home;
