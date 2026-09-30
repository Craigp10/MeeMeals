import React, { useState } from "react";
import Modal from "react-modal";
import { Meal, categoryLabel } from "../../types/meal";
import { categoryClass } from "../MealSlot/MealSlot";
import { CloseIcon } from "./MealForm";
import "./MealDialogs.scss";

interface Props {
  meal: Meal;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MealView = ({ meal, onClose, onEdit, onDelete }: Props) => {
  const [confirming, setConfirming] = useState(false);

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className={"meal-dialog meal-dialog--view " + categoryClass(meal.category)}
      overlayClassName="meal-dialog__overlay"
      aria={{ labelledby: "meal-view-title" }}
    >
      <div className="meal-dialog__band">
        <div className="meal-dialog__heading">
          <span className="meal-dialog__meta">
            {categoryLabel(meal.category)} · Added {meal.date_created}
          </span>
          <h2 id="meal-view-title">{meal.display_name}</h2>
        </div>
        <button
          type="button"
          className="meal-dialog__close"
          aria-label="Close"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="meal-dialog__body scroll-on-hover">
        {meal.description ? (
          <p className="meal-dialog__description">{meal.description}</p>
        ) : null}
        <div className="meal-dialog__columns">
          <section aria-labelledby="meal-view-ingredients">
            <h3 id="meal-view-ingredients">
              Ingredients <span>{meal.ingredients.length}</span>
            </h3>
            <ul className="meal-dialog__ingredients">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="meal-view-steps">
            <h3 id="meal-view-steps">Instructions</h3>
            <ol className="meal-dialog__steps">
              {meal.instructions.map((step, index) => (
                <li key={index}>
                  <span aria-hidden="true">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
        {meal.tags.length ? (
          <section aria-labelledby="meal-view-tags" className="meal-dialog__tags">
            <h3 id="meal-view-tags">Tags</h3>
            {meal.tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </section>
        ) : null}
      </div>

      {confirming ? (
        <div role="alert" className="meal-dialog__confirm">
          <span>
            Delete <strong>{meal.display_name}</strong>? This can't be undone.
          </span>
          <button
            type="button"
            className="meal-dialog__secondary"
            onClick={() => setConfirming(false)}
          >
            Keep
          </button>
          <button type="button" className="meal-dialog__danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      ) : null}

      <div className="meal-dialog__footer">
        <button
          type="button"
          className="meal-dialog__text-danger"
          onClick={() => setConfirming(true)}
        >
          Delete meal
        </button>
        <span className="meal-dialog__spacer"></span>
        <button type="button" className="meal-dialog__secondary" onClick={onClose}>
          Close
        </button>
        <button type="button" className="meal-dialog__primary" onClick={onEdit}>
          Edit meal
        </button>
      </div>
    </Modal>
  );
};

export default MealView;
