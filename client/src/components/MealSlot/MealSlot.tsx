import React, { useState } from "react";
import {
  Meal,
  SlotId,
  SlotRef,
  hasDragPayload,
  isSlotId,
  readDragPayload,
  slotLabel,
  writeDragPayload,
} from "../../pages/Calendar/planner";
import "./MealSlot.scss";

interface Props {
  variant: "compact" | "full";
  date: string;
  dateLabel: string;
  slot: SlotId;
  meal?: Meal;
  meals: Meal[];
  pickedMeal?: Meal;
  isToday: boolean;
  menuAbove?: boolean;
  menuAlignRight?: boolean;
  onPlace: (mealId: string) => void;
  onMove: (from: SlotRef) => void;
  onRemove: () => void;
}

export const categoryClass = (category: string) =>
  isSlotId(category) ? "meal-type--" + category : "meal-type--other";

const CloseIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/*
 * One meal time on one day. It accepts a meal three ways: dropped from the
 * meals panel or another slot, placed from the panel's selection ("Place
 * Here"), or chosen from its own Add menu, which is the keyboard path.
 */
const MealSlot = (props: Props) => {
  const [isOver, setIsOver] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const where = props.dateLabel + " " + props.slot;
  const self: SlotRef = { date: props.date, slot: props.slot };

  const handleDragOver = (event: React.DragEvent) => {
    if (!hasDragPayload(event)) return;
    event.preventDefault();
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setIsOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsOver(false);
    const payload = readDragPayload(event);
    if (!payload) return;
    if (payload.from) props.onMove(payload.from);
    else props.onPlace(payload.mealId);
  };

  const options = menuOpen
    ? props.meals
        .slice()
        .sort(
          (a, b) =>
            (a.category === props.slot ? 0 : 1) -
            (b.category === props.slot ? 0 : 1)
        )
    : [];

  const zoneClass = [
    "meal-slot",
    "meal-slot--" + props.variant,
    props.meal ? "meal-slot--filled" : "meal-slot--empty",
    props.isToday ? "meal-slot--today" : "",
    props.pickedMeal ? "meal-slot--placing" : "",
    isOver ? "meal-slot--over" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="group"
      aria-label={where}
      className={zoneClass}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {props.variant === "full" ? (
        <div className="meal-slot__label">
          <h3>{slotLabel(props.slot)}</h3>
          <span>{props.meal ? "1 meal" : "Nothing planned"}</span>
        </div>
      ) : null}

      <div className="meal-slot__body">
        {props.meal ? (
          <div
            className={"meal-slot__meal " + categoryClass(props.meal.category)}
            draggable={true}
            onDragStart={(event) =>
              writeDragPayload(event, { mealId: props.meal._id, from: self })
            }
          >
            <div className="meal-slot__meal-header">
              <span className="meal-slot__meal-name">
                {props.meal.display_name}
              </span>
              <button
                type="button"
                className="meal-slot__remove"
                aria-label={"Remove " + props.meal.display_name + " from " + where}
                onClick={props.onRemove}
              >
                <CloseIcon size={props.variant === "full" ? 16 : 14} />
              </button>
            </div>
            <span className="meal-slot__meal-meta">
              {slotLabel(
                isSlotId(props.meal.category) ? props.meal.category : props.slot
              )}
            </span>
          </div>
        ) : props.variant === "full" ? (
          <p className="meal-slot__empty">
            Nothing planned yet. Drop a meal here or use Add Meal.
          </p>
        ) : null}
      </div>

      <div className="meal-slot__actions">
        {props.pickedMeal ? (
          <button
            type="button"
            className="meal-slot__place"
            aria-label={"Place " + props.pickedMeal.display_name + " in " + where}
            onClick={() => props.onPlace(props.pickedMeal._id)}
          >
            Place Here
          </button>
        ) : (
          <button
            type="button"
            className="meal-slot__add"
            aria-label={"Add a meal to " + where}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <PlusIcon />
            {props.variant === "full" ? "Add Meal" : "Add"}
          </button>
        )}

        {menuOpen ? (
          <div
            role="group"
            aria-label={"Choose a meal for " + where}
            className={
              "meal-slot__menu" +
              (props.menuAbove ? " meal-slot__menu--above" : "") +
              (props.menuAlignRight ? " meal-slot__menu--right" : "")
            }
            onKeyDown={(event) => {
              if (event.key === "Escape") setMenuOpen(false);
            }}
          >
            <div className="meal-slot__menu-header">
              <span>Add to {slotLabel(props.slot)}</span>
              <button
                type="button"
                aria-label="Close meal list"
                onClick={() => setMenuOpen(false)}
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="meal-slot__menu-options">
              {options.length ? (
                options.map((meal) => (
                  <button
                    type="button"
                    key={meal._id}
                    onClick={() => {
                      setMenuOpen(false);
                      props.onPlace(meal._id);
                    }}
                  >
                    <span
                      className={"meal-slot__dot " + categoryClass(meal.category)}
                      aria-hidden="true"
                    ></span>
                    <span className="meal-slot__option-name">
                      {meal.display_name}
                    </span>
                    <span className="meal-slot__option-type">
                      {isSlotId(meal.category) ? slotLabel(meal.category) : ""}
                    </span>
                  </button>
                ))
              ) : (
                <p className="meal-slot__menu-empty">
                  You do not have any meals created!
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MealSlot;
