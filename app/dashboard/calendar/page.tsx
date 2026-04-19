"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useUser } from "@/context/user-context";
import styles from "./calendar.module.scss";

interface Meal {
  _id: string;
  display_name: string;
  category: string;
  ingredients: string[];
  description: string;
  tags: string[];
  instructions: string[];
  isActive: boolean;
  date_created: string;
}

interface MealTime {
  mealTime: string;
  mealId: string;
}

export default function CalendarPage() {
  const { user } = useUser();
  const [activeDate, setActiveDate] = useState(dayjs().format("M/D/YYYY"));
  const [mealTimes, setMealTimes] = useState<MealTime[]>([
    { mealTime: "Breakfast", mealId: "" },
    { mealTime: "Lunch", mealId: "" },
    { mealTime: "Dinner", mealId: "" },
    { mealTime: "Snack", mealId: "" },
  ]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMealId, setSelectedMealId] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<"" | "saving" | "saved" | "error">("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        // Fetch user meals
        const mealsRes = await fetch("/api/user/meals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        const mealsData = await mealsRes.json();
        if (mealsData.meals) {
          setMeals(mealsData.meals);
        }

        // Fetch date meals
        const dateRes = await fetch("/api/calendar/date-meals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, date: activeDate }),
        });
        const dateData = await dateRes.json();
        if (dateData.data) {
          setMealTimes([
            { mealTime: "Breakfast", mealId: dateData.data.breakfast || "" },
            { mealTime: "Lunch", mealId: dateData.data.lunch || "" },
            { mealTime: "Dinner", mealId: dateData.data.dinner || "" },
            { mealTime: "Snack", mealId: dateData.data.snack || "" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user?.id, activeDate]);

  const getMealById = (id: string) => meals.find((m) => m._id === id);

  const handleDateChange = (days: number) => {
    const newDate = dayjs(activeDate, "M/D/YYYY").add(days, "day").format("M/D/YYYY");
    setActiveDate(newDate);
  };

  const handleMealSelect = (mealId: string) => {
    setSelectedMealId(selectedMealId === mealId ? "" : mealId);
  };

  const handleDropMeal = async (index: number) => {
    if (!selectedMealId || !user?.id) return;

    const newMealTimes = [...mealTimes];
    newMealTimes[index].mealId = selectedMealId;
    setMealTimes(newMealTimes);
    setSelectedMealId("");

    await saveChanges(newMealTimes);
  };

  const handleRemoveMeal = async (index: number) => {
    if (!user?.id) return;

    const newMealTimes = [...mealTimes];
    newMealTimes[index].mealId = "";
    setMealTimes(newMealTimes);

    await saveChanges(newMealTimes);
  };

  const saveChanges = async (times: MealTime[]) => {
    setSaveStatus("saving");
    try {
      await fetch("/api/calendar/changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          date: activeDate,
          changes: {
            breakfast: times[0].mealId,
            lunch: times[1].mealId,
            dinner: times[2].mealId,
            snack: times[3].mealId,
          },
        }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      console.error("Error saving:", error);
      setSaveStatus("error");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.board}>
        <div className={styles.dateSelector}>
          <div className={styles.dateControls}>
            <button onClick={() => handleDateChange(-1)}>Prev</button>
            <span className={styles.activeDate}>
              {dayjs(activeDate, "M/D/YYYY").format("dddd, MMMM D, YYYY")}
            </span>
            <button onClick={() => handleDateChange(1)}>Next</button>
          </div>
        </div>

        {saveStatus && (
          <div className={`${styles.saveStatus} ${styles[saveStatus]}`}>
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "saved" && "Saved!"}
            {saveStatus === "error" && "Error saving"}
          </div>
        )}

        <div className={styles.planner}>
          {mealTimes.map((time, index) => {
            const meal = getMealById(time.mealId);
            return (
              <div key={time.mealTime} className={styles.mealSlot}>
                <label>{time.mealTime}</label>
                <div
                  className={`${styles.dropZone} ${selectedMealId ? styles.active : ""}`}
                  onClick={() => selectedMealId && handleDropMeal(index)}
                >
                  {meal ? (
                    <div className={styles.scheduledMeal}>
                      <span>{meal.display_name}</span>
                      <span
                        className={`${styles.removeBtn} glyphicon glyphicon-remove`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveMeal(index);
                        }}
                      />
                    </div>
                  ) : (
                    <div className={styles.emptySlot}>
                      {selectedMealId ? "Click to add meal" : "No meal scheduled"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.selection}>
        <h3>Your Meals</h3>
        <p className={styles.hint}>Click a meal to select, then click a time slot to add it</p>
        <div className={styles.mealList}>
          {meals.map((meal) => (
            <div
              key={meal._id}
              className={`${styles.mealItem} ${selectedMealId === meal._id ? styles.selected : ""}`}
              onClick={() => handleMealSelect(meal._id)}
            >
              <span className={styles.mealName}>{meal.display_name}</span>
              <span className={styles.mealCategory}>{meal.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
