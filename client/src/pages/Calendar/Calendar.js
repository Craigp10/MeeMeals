import React, { useState, useEffect } from "react";
import "./Calendar.css";
import apis from "../../api/index";
import MealDrop from "../../components/MealDrop/MealDrop";
import FilterSelection from "../../components/SelectionFilter/SelectionFilter";
import DateSelector from "../../components/DateSelector/DateSelector";
import dayjs from "dayjs";
import SaveLoader from "../../components/SavingLoader/SavingLoader";

const SAVING_STATUSES = {
  initialize: "",
  pending: "pending",
  success: "success",
  error: "error",
};

const Calendar = (props) => {
  const [activeDate, setActiveDate] = useState(dayjs().format("M/D/YYYY"));
  const [mealTimes, setMealTimes] = useState([
    { mealTime: "Breakfast", mealId: "" },
    { mealTime: "Lunch", mealId: "" },
    { mealTime: "Dinner", mealId: "" },
    { mealTime: "Snack", mealId: "" },
  ]);
  const [meals, setMeals] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [activeMealObj, setActiveMealObj] = useState({
    isActive: false,
    activeMealID: "",
  });
  const [activeMeal, setActiveMeal] = useState("");
  const [allowSave, setAllowSave] = useState(false);
  const [saveObject, setSaveObject] = useState({
    saving: false,
    status: SAVING_STATUSES.initialize,
  });

  const handleMealClick = (mealId) => {
    //Handles clicking a meal from the scroll wheel
    if (mealId == activeMealObj.activeMealID) {
      setActiveMealObj({
        isActive: false,
        activeMealID: "",
      });
    } else {
      setActiveMealObj({
        isActive: true,
        activeMealID: mealId,
      });
    }
  };

  const handleMealRemoveClick = (index) => {
    //Handles removing a meal from one of the meal times
    const updateMealTimes = mealTimes;
    updateMealTimes[index].mealId = "";
    setMealTimes([...updateMealTimes]);
    handleSave();
  };

  const handleMealDropClick = (index) => {
    //Handles when user is 'dropping' a meal on to one of the meal times
    const updateMealTimes = mealTimes;
    updateMealTimes[index].mealId = meals.filter(
      (meal_) => meal_._id == activeMealObj.activeMealID
    )[0]._id;
    setActiveMealObj({
      isActive: false,
      activeMealID: "",
    });
    setMealTimes([...updateMealTimes]);
    handleSave();
  };

  const handleSave = () => {
    setSaveObject({
      saving: true,
      status: SAVING_STATUSES.pending,
    });
  };

  useEffect(async () => {
    //On mount, pull meals and any meal times for current user
    await apis
      .getUserMeals({ user_id: props.user.id })
      .then((resp) => setMeals(resp.data.meals))
      .catch((err) => {
        console.log(err);
        setMeals([]);
      });
    await apis
      .getDateMeals({
        date: activeDate,
        user_id: props.user.id,
      })
      .then((resp) => {
        const schedule = resp.data.data;
        const activeMealTimes = mealTimes;
        activeMealTimes[0].mealId = schedule?.breakfast;
        activeMealTimes[1].mealId = schedule?.lunch;
        activeMealTimes[2].mealId = schedule?.dinner;
        activeMealTimes[3].mealId = schedule?.snack;
        setMealTimes([...activeMealTimes]);
      })
      .catch((err) => {
        console.log(err);
        setMealTimes([]);
      });
  }, []);

  useEffect(async () => {
    if (allowSave) {
      //avoids saving with empty meal times

      const changes = {
        breakfast: mealTimes[0].mealId,
        lunch: mealTimes[1].mealId,
        dinner: mealTimes[2].mealId,
        snack: mealTimes[3].mealId,
      };

      await apis
        .saveCalendarChanges({
          date: activeDate,
          user_id: props.user.id,
          changes,
        })
        .then((resp) => {
          setSaveObject({
            ...{
              saving: saveObject.saving,
              status: SAVING_STATUSES.success,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          setSaveObject({
            ...{
              saving: saveObject.saving,
              status: SAVING_STATUSES.error,
            },
          });
        });
    }
  }, [mealTimes]);

  const handleActiveDateChange = async (newActiveDate) => {
    setAllowSave(false);
    setActiveDate(newActiveDate);
  };

  useEffect(async () => {
    //Remove ability to save and pull new dates data
    await apis
      .getDateMeals({
        date: activeDate,
        user_id: props.user.id,
      })
      .then((resp) => {
        const schedule = resp.data.data;
        const activeMealTimes = [
          { mealTime: "Breakfast", mealId: "" },
          { mealTime: "Lunch", mealId: "" },
          { mealTime: "Dinner", mealId: "" },
          { mealTime: "Snack", mealId: "" },
        ];
        if (resp.status == 200) {
          activeMealTimes[0].mealId = schedule?.breakfast;
          activeMealTimes[1].mealId = schedule?.lunch;
          activeMealTimes[2].mealId = schedule?.dinner;
          activeMealTimes[3].mealId = schedule?.snack;
        }
        setMealTimes([...activeMealTimes]);
        setAllowSave(true);
      });
  }, [activeDate]);

  useEffect(() => {
    //Timer to update displayed saving status to user
    const timer = setTimeout(() => {
      let saving;
      const status = saveObject.status;
      if (["success", "error", ""].includes(status)) {
        saving = false;
      } else {
        saving = true;
      }
      setSaveObject({
        saving,
        status,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [saveObject.status]);
  return (
    <div className="calendar-wrapper">
      <div className="calendar__board">
        <div className="calendar__board__dates">
          <DateSelector
            activeDate={activeDate}
            handleActiveDateChange={handleActiveDateChange}
          />
        </div>
        <div className="calendar__board__planner">
          <div className="calendar__planner-saver">
            {saveObject.status == "" ? null : saveObject.status == "error" ? (
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
              <SaveLoader
                saving={saveObject.saving}
                status={saveObject.status}
                setSaveObject={setSaveObject}
              />
            )}
          </div>
          <div className="calendar__planner-content">
            {mealTimes.map((meal, index) => {
              return (
                <div className="calendar__planner-meal" key={index}>
                  <label>{meal.mealTime}</label>
                  <MealDrop
                    meal={
                      meals.filter((meal_) => meal_._id == meal.mealId)
                        .length == 0
                        ? {}
                        : meals.filter((meal_) => meal_._id == meal.mealId)[0]
                    }
                    activeMealIsActive={activeMealObj.isActive}
                    mealClickCallback={handleMealDropClick}
                    index={index}
                    removeMeal={handleMealRemoveClick}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="calendar-content__selection">
        <FilterSelection
          setSearchFilter={setSearchFilter}
          searchFilter={searchFilter}
          setCategoryFilter={setCategoryFilter}
          categoryFilter={categoryFilter}
        />

        <ul className="calendar-content__selection-scroll">
          {meals
            .filter((meal) => {
              if (categoryFilter == "all") {
                const mealData = [
                  meal.display_name,
                  ...meal.tags.map((tag) => tag),
                  ...meal.ingredients.map((ingredient) => ingredient),
                ];
                return mealData
                  .join(" ")
                  .toLowerCase()
                  .includes(searchFilter.toLowerCase());
              } else {
                const mealData = [
                  meal.display_name,
                  ...meal.tags.map((tag) => tag),
                  ...meal.ingredients.map((ingredient) => ingredient),
                ];
                return (
                  mealData
                    .join(" ")
                    .toLowerCase()
                    .includes(searchFilter.toLowerCase()) &&
                  meal.category == categoryFilter
                );
              }
            })
            .map((meal, index) => {
              return (
                <div key={index} className="calendar__selection__meal-wrapper">
                  <li
                    className="calendar__selection__meal"
                    onClick={() => handleMealClick(meal._id)}
                  >
                    <div className="calendar__selection__meal-header">
                      <div className="calendar__selection__meal-displayname">
                        {meal.display_name}
                      </div>
                    </div>
                    <div className="calendar__selection__meal-body">
                      <label>Ingredients</label>
                      <div className="calendar__selection__meal-tags">
                        {meal.ingredients.map((ingredients, idx) => (
                          <span className="__meal-tag" key={idx}>
                            {ingredients}
                          </span>
                        ))}
                      </div>
                      <hr />
                      <label>Tags</label>
                      <div className="calendar__selection__meal-tags">
                        {meal.tags.map((tag, idx) => (
                          <span className="__meal-tag" key={idx}>
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
