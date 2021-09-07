import React, { FC, useState, useEffect, useContext } from "react";
import "./scss/compiled.scss";
import apis, { getDateMeals } from "../../api/index";
import MealDrop from "../../components/MealDrop/MealDrop";
import FilterSelection from "../../components/SelectionFilter/SelectionFilter";
import DateSelector from "../../components/DateSelector/DateSelector";
import dayjs from "dayjs";
import SaveLoader from "../../components/SavingLoader/SavingLoader";
import { userContext, windowSizeContext } from "../../App";

const SAVING_STATUSES = {
  initialize: "",
  pending: "pending",
  success: "success",
  error: "error",
};

type mealTime = {
  mealTime: string;
  mealId: string;
};

const EMPTY_MEAL = {
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

type meals = {
  category: string;
  date_created: string;
  description: string;
  display_name: string;
  ingredients: string[];
  instructions: string[];
  isActive: boolean;
  tags: string[];
  _id: string;
};

type activeMeal = {
  isActive: boolean;
  activeMealID: string;
};

type saveObj = {
  saving: boolean;
  status: string;
};

interface User {
  id: string;
  username: string;
  email: string;
}

const Calendar = (props: any) => {
  const [activeDate, setActiveDate] = useState<string>(
    dayjs().format("M/D/YYYY")
  );
  const [mealTimes, setMealTimes] = useState<mealTime[]>([
    { mealTime: "Breakfast", mealId: "" },
    { mealTime: "Lunch", mealId: "" },
    { mealTime: "Dinner", mealId: "" },
    { mealTime: "Snack", mealId: "" },
  ]);
  const [meals, setMeals] = useState<meals[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [activeMeal, setActiveMeal] = useState<activeMeal>({
    isActive: false,
    activeMealID: "",
  });
  const [allowSave, setAllowSave] = useState<boolean>(false);
  const [saveObject, setSaveObject] = useState<saveObj>({
    saving: false,
    status: SAVING_STATUSES.initialize,
  });
  const [showSelection, setShowSelection] = useState<boolean>(false);
  const user = useContext<User>(userContext);
  const windowSize = useContext(windowSizeContext);
  const isMobileView = windowSize.width < 768 ? true : false;

  const handleMealClick = (mealId: string) => {
    //Handles clicking a meal from the scroll wheel
    if (mealId == activeMeal.activeMealID) {
      setActiveMeal({
        isActive: false,
        activeMealID: "",
      });
    } else {
      setActiveMeal({
        isActive: true,
        activeMealID: mealId,
      });
    }
  };

  const handleMealRemoveClick = (index: number) => {
    //Handles removing a meal from one of the meal times
    const updateMealTimes: mealTime[] = mealTimes;
    updateMealTimes[index].mealId = "";
    setMealTimes([...updateMealTimes]);
    handleSave();
  };

  const handleMealDropClick = (index: number) => {
    //Handles when user is 'dropping' a meal on to one of the meal times
    const updateMealTimes = mealTimes;
    updateMealTimes[index].mealId = meals.filter(
      (meal_: any) => meal_._id == activeMeal.activeMealID
    )[0]._id;

    setActiveMeal({
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

  useEffect(() => {
    //On mount, pull meals and any meal times for current user
    const setMealsFunc = async () =>
      await apis
        .getUserMeals({ user_id: user.id })
        .then((resp) => setMeals(resp.data.meals))
        .catch((err) => {
          console.log(err);
          setMeals([]);
        });
    const pullDateMeals = async () =>
      await apis
        .getDateMeals({
          date: activeDate,
          user_id: user.id,
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

    setMealsFunc();
    pullDateMeals();
  }, []);

  useEffect(() => {
    if (allowSave) {
      //avoids saving with empty meal times
      const changes = {
        breakfast: mealTimes[0].mealId,
        lunch: mealTimes[1].mealId,
        dinner: mealTimes[2].mealId,
        snack: mealTimes[3].mealId,
      };

      const saveChanges = async () =>
        await apis
          .saveCalendarChanges({
            date: activeDate,
            user_id: user.id,
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

      saveChanges();
    }
  }, [mealTimes]);

  const handleActiveDateChange = async (newActiveDate: string) => {
    setAllowSave(false);
    setActiveDate(newActiveDate);
  };

  useEffect(() => {
    //Remove ability to save and pull new dates data
    const getDateMealsFunc = async () =>
      await apis
        .getDateMeals({
          date: activeDate,
          user_id: user.id,
        })
        .then((resp) => {
          const schedule = resp.data.data;
          const activeMealTimes: mealTime[] = [
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

    getDateMealsFunc();
  }, [activeDate]);

  useEffect(() => {
    //Timer to update displayed saving status to user
    const timer = setTimeout(() => {
      const status = saveObject.status;
      // let saving
      // ["success", "error", ""].includes(status) ? saving = false : saving = true;

      setSaveObject({
        saving: ["success", "error", ""].includes(status) ? false : true,
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
            isMobileView={windowSize.width < 768 ? true : false}
          />
        </div>
        <div className="calendar__board__planner">
          {isMobileView ? (
            <div className="calendar__board__planner_mobile-menu">
              <span
                className="glyphicon glyphicon-menu-left"
                onClick={() => setShowSelection(true)}
              ></span>
            </div>
          ) : (
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
          )}
          <div className="calendar__planner-content">
            {mealTimes.map((meal, index) => {
              return (
                <div className="calendar__planner-meal" key={index}>
                  <label>{meal.mealTime}</label>
                  <MealDrop
                    meal={
                      meals.filter((meal_) => meal_._id == meal.mealId)
                        .length == 0
                        ? EMPTY_MEAL
                        : meals.filter((meal_) => meal_._id == meal.mealId)[0]
                    }
                    activeMealIsActive={activeMeal.isActive}
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
      {isMobileView ? (
        showSelection ? (
          <div className="calendar-content__selection">
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
                    <div
                      key={index}
                      className="calendar__selection__meal-wrapper"
                    >
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
        ) : null
      ) : (
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
                  <div
                    key={index}
                    className="calendar__selection__meal-wrapper"
                  >
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
      )}
    </div>
  );
};

export default Calendar;
