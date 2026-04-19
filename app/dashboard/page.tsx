"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useUser } from "@/context/user-context";
import styles from "./homepage.module.scss";

const GRID_LAYOUT = [
  { style: { gridColumn: 2, gridRow: 1 }, text: "Sunday", isDay: true },
  { style: { gridColumn: 3, gridRow: 1 }, text: "Monday", isDay: true },
  { style: { gridColumn: 4, gridRow: 1 }, text: "Tuesday", isDay: true },
  { style: { gridColumn: 5, gridRow: 1 }, text: "Wednesday", isDay: true },
  { style: { gridColumn: 6, gridRow: 1 }, text: "Thursday", isDay: true },
  { style: { gridColumn: 7, gridRow: 1 }, text: "Friday", isDay: true },
  { style: { gridColumn: 8, gridRow: 1 }, text: "Saturday", isDay: true },
  { style: { gridColumn: 1, gridRow: 2 }, text: "Breakfast", isDay: false },
  { style: { gridColumn: 1, gridRow: 3 }, text: "Lunch", isDay: false },
  { style: { gridColumn: 1, gridRow: 4 }, text: "Dinner", isDay: false },
  { style: { gridColumn: 1, gridRow: 5 }, text: "Snack", isDay: false },
];

const generateCurrentWeek = () => {
  return new Array(7)
    .fill(0)
    .map((_, idx) => dayjs().day(idx).format("M/D/YYYY"));
};

interface Meal {
  category: string;
  date_created: string;
  description: string;
  display_name: string;
  ingredients: string[];
  instructions: string[];
  isActive: boolean;
  tags: string[];
  _id: string;
}

interface WeekMeal {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snack?: string;
  day: string;
  pulled: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();
  const [weekMeals, setWeekMeals] = useState<WeekMeal[]>([]);
  const [userMeals, setUserMeals] = useState<Meal[]>([]);
  const [week] = useState<string[]>(generateCurrentWeek());

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [calendarRes, mealsRes] = await Promise.all([
          fetch("/api/calendar/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, week }),
          }),
          fetch("/api/user/meals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id }),
          }),
        ]);

        const calendarData = await calendarRes.json();
        const mealsData = await mealsRes.json();

        if (calendarData.meals) {
          setWeekMeals(calendarData.meals);
        }
        if (mealsData.meals) {
          setUserMeals(mealsData.meals);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user?.id, week]);

  const handleMealClick = (mealId: string) => {
    router.push(`/dashboard/meals?preview=${mealId}`);
  };

  const getMealName = (mealId?: string) => {
    if (!mealId) return null;
    const meal = userMeals.find((m) => m._id === mealId);
    return meal?.display_name;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.board}>
        <div className={styles.header}>
          <h2>Meals for the Week!</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.grid}>
            {GRID_LAYOUT.map((vert, idx) =>
              vert.isDay ? (
                <div style={vert.style} className={styles.gridLayoutTop} key={idx}>
                  <span>{vert.text}</span>
                  <span>{dayjs(week[idx]).format("M/D")}</span>
                </div>
              ) : (
                <div style={vert.style} className={styles.gridLayoutLeft} key={idx}>
                  <span>{vert.text}</span>
                </div>
              )
            )}

            {weekMeals.length > 0 &&
              userMeals.length > 0 &&
              weekMeals.map((day, idx) => {
                if (!day.pulled) return null;

                return (
                  <div key={day.day} style={{ display: "contents" }}>
                    {getMealName(day.breakfast) && (
                      <span
                        className={styles.gridMeal}
                        onClick={() => handleMealClick(day.breakfast!)}
                        style={{ gridColumn: idx + 2, gridRow: 2 }}
                      >
                        <p>{getMealName(day.breakfast)}</p>
                      </span>
                    )}
                    {getMealName(day.lunch) && (
                      <span
                        className={styles.gridMeal}
                        onClick={() => handleMealClick(day.lunch!)}
                        style={{ gridColumn: idx + 2, gridRow: 3 }}
                      >
                        <p>{getMealName(day.lunch)}</p>
                      </span>
                    )}
                    {getMealName(day.dinner) && (
                      <span
                        className={styles.gridMeal}
                        onClick={() => handleMealClick(day.dinner!)}
                        style={{ gridColumn: idx + 2, gridRow: 4 }}
                      >
                        <p>{getMealName(day.dinner)}</p>
                      </span>
                    )}
                    {getMealName(day.snack) && (
                      <span
                        className={styles.gridMeal}
                        onClick={() => handleMealClick(day.snack!)}
                        style={{ gridColumn: idx + 2, gridRow: 5 }}
                      >
                        <p>{getMealName(day.snack)}</p>
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
