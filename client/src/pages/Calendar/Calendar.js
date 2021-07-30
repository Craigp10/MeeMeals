import React, { useState, useEffect } from "react";
import "./Calendar.css";
import apis from "../../api/index";
import MealDrop from "../../components/MealDrop/MealDrop";
import FilterSelection from "../../components/SelectionFilter/SelectionFilter";
import DateSelector from "../../components/DateSelector/DateSelector";
import dayjs from "dayjs";
import SaveLoader from "../../components/SavingLoader/SavingLoader";

const Calendar = (props) => {
  const [activeDate, setActiveDate] = useState(dayjs().format("M/D/YYYY"));
  const [mealTimes, setMealTimes] = useState([
    { meal_time: "Breakfast", meal_id: "" },
    { meal_time: "Lunch", meal_id: "" },
    { meal_time: "Dinner", meal_id: "" },
    { meal_time: "Snack", meal_id: "" },
  ]);

  const [meals, setMeals] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [activeMealClick, setActiveMealClick] = useState(false);
  const [activeMeal, setActiveMeal] = useState("");
  const [allowSave, setAllowSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // available values: ["", "success", "pending", "error"]
  const [saveTimer, setSaveTimer] = useState(0);

  const handleMealClick = (meal_id) => {
    setActiveMealClick(!activeMealClick);
    if (activeMealClick) {
      setActiveMeal("");
    } else {
      setActiveMeal(meal_id);
    }
  };

  const handleMealRemoveClick = (index) => {
    const updateMealTimes = mealTimes;
    updateMealTimes[index].meal_id = "";
    setMealTimes([...updateMealTimes]);
  };

  const handleMealDropClick = (index) => {
    const updateMealTimes = mealTimes;
    updateMealTimes[index].meal_id = meals.filter(
      (meal_) => meal_._id == activeMeal
    )[0]._id;
    setMealTimes([...updateMealTimes]);
    setActiveMealClick(false);
    setActiveMeal("");
  };

  useEffect(async () => {
    await apis
      .getUserMeals({ user_id: "60f5ffcaf12aefb5c7942f63" })
      .then((resp) => setMeals(resp.data.meals));
  }, []);

  useEffect(async () => {
    setAllowSave(false);
    setSaveStatus("");
    await apis
      .getDateMeals({
        date: activeDate,
        user_id: "60f5ffcaf12aefb5c7942f63",
      })
      .then((resp) => {
        const schedule = resp.data.data;
        const activeMealTimes = [
          { meal_time: "Breakfast", meal_id: "" },
          { meal_time: "Lunch", meal_id: "" },
          { meal_time: "Dinner", meal_id: "" },
          { meal_time: "Snack", meal_id: "" },
        ];
        if (resp.status == 200) {
          activeMealTimes[0].meal_id = schedule.breakfast;
          activeMealTimes[1].meal_id = schedule.lunch;
          activeMealTimes[2].meal_id = schedule.dinner;
          activeMealTimes[3].meal_id = schedule.snack;
          setMealTimes([...activeMealTimes]);
        } else {
          setMealTimes([...activeMealTimes]);
        }
      });
    return setAllowSave(true);
  }, [activeDate]);

  useEffect(async () => {
    if (allowSave) {
      setSaving(true);
      setSaveStatus("pending");
      setSaveTimer(0);

      const changes = {
        breakfast: mealTimes[0].meal_id,
        lunch: mealTimes[1].meal_id,
        dinner: mealTimes[2].meal_id,
        snack: mealTimes[3].meal_id,
      };
      // const id = saveInterval();
      await apis
        .saveCalendarChanges({
          date: activeDate,
          user_id: "60f5ffcaf12aefb5c7942f63",
          changes,
        })
        .then((resp) => {
          resp.status == 200
            ? setSaveStatus("success")
            : setSaveStatus("error"); //Probably need more workflow logic for errors
        })
        .catch((err) => {
          console.log(err);
          setSaveStatus("error");
        });
    }
  }, [mealTimes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (saveStatus == "success" || saveStatus == "error") {
        setSaving(false);
      } else {
        setSaving(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [saveStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSaveTimer(saveTimer + 1);
    }, 1000);
    if (saveTimer == 5) {
      setSaveStatus("");
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [saveTimer]);

  return (
    <div className="calendar-content-wrapper">
      <div className="calendar-content-board">
        <div className="calendar-content-board-dates">
          <DateSelector activeDate={activeDate} setActiveDate={setActiveDate} />
        </div>
        <div className="calendar-content-board-planner">
          <div className="calendar-planner-saver">
            {saveStatus == "" ? (
              <p className="fade"></p>
            ) : saveStatus == "error" ? (
              <p
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontSize: "1.2rem",
                }}
              >
                Error saving changes
              </p>
            ) : (
              <SaveLoader saving={saving} saveStatus={saveStatus} />
            )}
          </div>
          <div className="calendar-planner-content">
            {mealTimes.map((meal, index) => {
              return (
                <div className="calendar-planner-meal" key={index}>
                  <label>{meal.meal_time}</label>
                  <MealDrop
                    meal={
                      meals.filter((meal_) => meal_._id == meal.meal_id)
                        .length == 0
                        ? {}
                        : meals.filter((meal_) => meal_._id == meal.meal_id)[0]
                    }
                    activeMealClick={activeMealClick}
                    mealClickCallback={handleMealDropClick}
                    index={index}
                    removeMeal={handleMealRemoveClick}
                  />
                </div>
              );
            })}
          </div>
          <></>
        </div>
      </div>
      <div className="calendar-content-meal-selection">
        <FilterSelection
          setSearchFilter={setSearchFilter}
          searchFilter={searchFilter}
          setCategoryFilter={setCategoryFilter}
          categoryFilter={categoryFilter}
        />

        <ul className="calendar-content-meal-selection-scroll">
          {meals
            .filter((meal) => {
              if (categoryFilter == "all") {
                let mealData = [
                  meal.display_name.toLowerCase(),
                  ...meal.tags.map((tag) => tag.toLowerCase()),
                  ...meal.ingredients.map((ingredient) =>
                    ingredient.toLowerCase()
                  ),
                ];
                return mealData.join(" ").includes(searchFilter.toLowerCase());
              } else {
                return (
                  meal.display_name
                    .toLowerCase()
                    .includes(searchFilter.toLowerCase()) &&
                  meal.category == categoryFilter
                );
              }
            })
            .map((meal, index) => {
              return (
                <div key={index} className="selection-scroll-meal-wrapper">
                  <li
                    className="selection-scroll-meal"
                    onClick={() => handleMealClick(meal._id)}
                  >
                    <div className="calendar-content-meal-header">
                      <div className="calendar-content-meal-displayname">
                        {meal.display_name}
                      </div>
                    </div>
                    <div className="calendar-content-meal-body">
                      <label>Ingredients</label>
                      <div className="calendar-content-meal-tags">
                        {meal.ingredients.map((ingredients, idx) => (
                          <span className="tag" key={idx}>
                            {ingredients}
                          </span>
                        ))}
                      </div>
                      <hr />
                      <label>Tags</label>
                      <div className="calendar-content-meal-tags">
                        {meal.tags.map((tag, idx) => (
                          <span className="tag" key={idx}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                </div>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
