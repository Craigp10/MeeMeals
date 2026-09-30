import React from "react";
import { Meal, categoryLabel } from "../../types/meal";
import { categoryClass } from "../MealSlot/MealSlot";
import "./MealCard.scss";

interface Props {
  meal: Meal;
  confirmingDelete: boolean;
  onView: () => void;
  onEdit: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
}

const plural = (n: number, one: string, many: string) =>
  n + " " + (n === 1 ? one : many);

const MealCard = ({ meal, ...props }: Props) => (
  <li className={"meal-card " + categoryClass(meal.category)}>
    <div className="meal-card__band">
      <span className="meal-card__type">{categoryLabel(meal.category)}</span>
      <button
        type="button"
        className="meal-card__icon"
        aria-label={"Edit " + meal.display_name}
        onClick={props.onEdit}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 20h4L19 9l-4-4L4 16v4z" />
          <path d="M13.5 6.5l4 4" />
        </svg>
      </button>
      <button
        type="button"
        className="meal-card__icon"
        aria-label={"Delete " + meal.display_name}
        onClick={props.onAskDelete}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
        </svg>
      </button>
    </div>

    <div className="meal-card__body">
      <h2 className="meal-card__name">
        <button type="button" onClick={props.onView}>
          {meal.display_name}
        </button>
      </h2>
      {meal.description ? (
        <p className="meal-card__description">{meal.description}</p>
      ) : null}
      <p className="meal-card__counts">
        <strong>{plural(meal.ingredients.length, "ingredient", "ingredients")}</strong>
        {" · "}
        {plural(meal.instructions.length, "step", "steps")}
      </p>
      {meal.tags.length ? (
        <ul aria-label="Tags" className="meal-card__tags">
          {meal.tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      ) : null}
    </div>

    {props.confirmingDelete ? (
      <div role="alert" className="meal-card__confirm">
        <span>Delete this meal?</span>
        <button
          type="button"
          className="meal-card__keep"
          onClick={props.onCancelDelete}
        >
          Keep
        </button>
        <button
          type="button"
          className="meal-card__delete"
          onClick={props.onDelete}
        >
          Delete
        </button>
      </div>
    ) : (
      <div className="meal-card__footer">Added {meal.date_created}</div>
    )}
  </li>
);

export default MealCard;
