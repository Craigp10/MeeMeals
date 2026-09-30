import React from "react";
import {
  Meal,
  isSlotId,
  slotLabel,
  writeDragPayload,
} from "../../pages/Calendar/planner";
import { categoryClass } from "../MealSlot/MealSlot";
import "./scss/compiled.scss";

interface Props {
  meals: Meal[];
  pickedMealId: string;
  handleMealClick: (mealId: string) => void;
  categoryFilter: string;
  searchFilter: string;
  describedBy?: string;
}

export const filterMeals = (
  meals: Meal[],
  categoryFilter: string,
  searchFilter: string
) => {
  const query = searchFilter.toLowerCase();
  return meals.filter((meal) => {
    const searchable = [meal.display_name, ...meal.tags, ...meal.ingredients]
      .join(" ")
      .toLowerCase();
    return (
      searchable.includes(query) &&
      (categoryFilter === "all" || meal.category === categoryFilter)
    );
  });
};

const GripIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="9" cy="6" r="1.6" />
    <circle cx="15" cy="6" r="1.6" />
    <circle cx="9" cy="12" r="1.6" />
    <circle cx="15" cy="12" r="1.6" />
    <circle cx="9" cy="18" r="1.6" />
    <circle cx="15" cy="18" r="1.6" />
  </svg>
);

const MealSelection = (props: Props) => {
  const visible = filterMeals(
    props.meals,
    props.categoryFilter,
    props.searchFilter
  );

  return (
    <ul aria-label="Meals" className="meal-selection-wrapper">
      {visible.map((meal) => {
        const isPicked = props.pickedMealId === meal._id;
        return (
          <li key={meal._id}>
            <button
              type="button"
              draggable={true}
              className={
                "meal-selection__meal " +
                categoryClass(meal.category) +
                (isPicked ? " meal-selection__meal--picked" : "")
              }
              aria-pressed={isPicked}
              aria-describedby={props.describedBy}
              onClick={() => props.handleMealClick(meal._id)}
              onDragStart={(event) =>
                writeDragPayload(event, { mealId: meal._id })
              }
            >
              <span className="meal-selection__meal-header">
                <span className="meal-selection__meal-name">
                  {meal.display_name}
                </span>
                <GripIcon />
              </span>
              <span className="meal-selection__meal-body">
                {isSlotId(meal.category) ? (
                  <span className="meal-selection__meal-tag">
                    {slotLabel(meal.category)}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
      {!visible.length ? (
        <li className="meal-selection__empty">
          {props.meals.length
            ? "No meals match your search."
            : "You do not have any meals created!"}
        </li>
      ) : null}
    </ul>
  );
};

export default MealSelection;
