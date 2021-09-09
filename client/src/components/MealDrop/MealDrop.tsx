import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEventHandler,
} from "react";
import Meals from "../../pages/Meals/Meals";
import "./MealDrop.scss";

type Meal = {
  _id: string;
  display_name: string;
  date_created: string;
  ingredients: string[];
  description: string;
  category: string;
  tags: string[];
  instructions: string[];
  isActive: boolean;
};
interface Props {
  activeMealIsActive: boolean;
  index: number;
  mealClickCallback?: (index: number) => void;
  meal: Meal;
  removeMeal?: (index: number) => void;
  meals: Meal[];
  handleMealDropSelect?: (mealID: string, index: number) => void;
  isMobileView: boolean;
}

const MealDrop = (props: Props) => {
  return (
    <div
      className={
        props.activeMealIsActive
          ? "mealdrop-wrapper active"
          : "mealdrop-wrapper"
      }
      // @ts-ignore
      onClick={
        props.activeMealIsActive
          ? () => props.mealClickCallback(props.index)
          : null
      }
    >
      {props.meal.isActive ? (
        <div className="mealdrop__content">
          <div className="mealdrop__content__header">
            <div className="mealdrop__content__header-displayname">
              {props.meal.display_name}
            </div>
            <div className="mealdrop__content__header-options">
              <span
                className="glyphicon glyphicon-remove"
                onClick={() => props.removeMeal(props.index)}
              ></span>
            </div>
          </div>
          <div className="mealdrop__content__body">
            {props.meal.description}
          </div>
          <div className="mealdrop__content__footer">
            <span>Created On: {props.meal.date_created}</span>
            <span>Last scheduled: 7/5/21</span>
          </div>
        </div>
      ) : props.isMobileView ? (
        <>
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              props.handleMealDropSelect(e.target.value, props.index)
            }
            value={""}
          >
            <option key="" value={""} disabled={true}>
              Select a Meal
            </option>
            {props.meals.map((meal: Meal, idx: number) => (
              <option key={meal._id} value={meal._id}>
                {meal.display_name}
              </option>
            ))}
          </select>
        </>
      ) : (
        <div className="mealdrop__content-no-meal"></div>
      )}
    </div>
  );
};

export default MealDrop;
