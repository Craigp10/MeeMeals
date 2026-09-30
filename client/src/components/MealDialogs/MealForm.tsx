import React, { useState } from "react";
import Modal from "react-modal";
import { MEAL_CATEGORIES, Meal } from "../../types/meal";
import "./MealDialogs.scss";

Modal.setAppElement("#root");

export type MealDraft = Pick<
  Meal,
  "display_name" | "description" | "category" | "ingredients" | "instructions" | "tags"
>;

type ListField = "ingredients" | "instructions" | "tags";

interface Props {
  mode: "create" | "edit";
  meal?: Meal;
  saving: boolean;
  saveError: string;
  onClose: () => void;
  onSubmit: (draft: MealDraft) => void;
}

export const CloseIcon = () => (
  <svg
    width="20"
    height="20"
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

const SmallX = () => (
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
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const Chevron = ({ d }: { d: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const TrashIcon = () => (
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
);

const draftFrom = (meal?: Meal): MealDraft => ({
  display_name: meal?.display_name ?? "",
  description: meal?.description ?? "",
  category: meal?.category ?? "",
  ingredients: meal ? meal.ingredients.slice() : [],
  instructions: meal ? meal.instructions.slice() : [],
  tags: meal ? meal.tags.slice() : [],
});

// The server accepts a meal only when every field is filled in.
const errorsFor = (draft: MealDraft) => ({
  display_name: draft.display_name.trim() ? "" : "Give the meal a name.",
  category: draft.category ? "" : "Choose a meal type.",
  description: draft.description.trim() ? "" : "Add a short description.",
  ingredients: draft.ingredients.length ? "" : "Add at least one ingredient.",
  instructions: draft.instructions.length ? "" : "Add at least one step.",
  tags: draft.tags.length ? "" : "Add at least one tag.",
});

const NO_ERRORS: ReturnType<typeof errorsFor> = {
  display_name: "",
  category: "",
  description: "",
  ingredients: "",
  instructions: "",
  tags: "",
};

/*
 * Create and edit share this form. Lists (ingredients, steps, tags) are edited
 * through their own add inputs; steps also reorder with up/down buttons so it
 * works from a keyboard or a touch screen. Errors only show after a save
 * attempt, and each one sits under the field it belongs to.
 */
const MealForm = (props: Props) => {
  const [draft, setDraft] = useState<MealDraft>(() => draftFrom(props.meal));
  const [pending, setPending] = useState({ ingredients: "", instructions: "", tags: "" });
  const [triedSave, setTriedSave] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const errors = errorsFor(draft);
  const shown = triedSave ? errors : NO_ERRORS;
  const hasErrors = Object.values(errors).some(Boolean);

  const update = (patch: Partial<MealDraft>) => setDraft({ ...draft, ...patch });

  const addTo = (field: ListField) => {
    const text = pending[field].trim();
    if (!text) return;
    update({ [field]: draft[field].concat([text]) } as Partial<MealDraft>);
    setPending({ ...pending, [field]: "" });
  };

  const removeFrom = (field: ListField, index: number) => {
    const list = draft[field].slice();
    list.splice(index, 1);
    update({ [field]: list } as Partial<MealDraft>);
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const to = index + direction;
    if (to < 0 || to >= draft.instructions.length) return;
    const steps = draft.instructions.slice();
    const [moved] = steps.splice(index, 1);
    steps.splice(to, 0, moved);
    update({ instructions: steps });
    setAnnouncement("Step moved to position " + (to + 1) + ".");
  };

  const submit = () => {
    setTriedSave(true);
    if (hasErrors) {
      setAnnouncement("Some fields still need filling in.");
      return;
    }
    props.onSubmit({
      ...draft,
      display_name: draft.display_name.trim(),
      description: draft.description.trim(),
    });
  };

  const onEnter = (field: ListField) => (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTo(field);
    }
  };

  const listInput = (
    field: ListField,
    id: string,
    label: string,
    placeholder: string,
    addLabel: string
  ) => (
    <>
      <div className="meal-form__add">
        <label htmlFor={id} className="meal-form__sr">
          {label}
        </label>
        <input
          id={id}
          type="text"
          value={pending[field]}
          placeholder={placeholder}
          aria-describedby={id + "-error"}
          className={shown[field] ? "meal-form__invalid" : ""}
          onChange={(event) => setPending({ ...pending, [field]: event.target.value })}
          onKeyDown={onEnter(field)}
        />
        <button
          type="button"
          className="meal-dialog__secondary"
          onClick={() => addTo(field)}
        >
          {addLabel}
        </button>
      </div>
      <span id={id + "-error"} className="meal-form__error">
        {shown[field]}
      </span>
    </>
  );

  const chips = (field: "ingredients" | "tags", label: string, removePrefix: string) =>
    draft[field].length ? (
      <ul aria-label={label} className="meal-form__chips">
        {draft[field].map((text, index) => (
          <li key={index + text}>
            {text}
            <button
              type="button"
              aria-label={removePrefix + text}
              onClick={() => removeFrom(field, index)}
            >
              <SmallX />
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  const isCreate = props.mode === "create";

  return (
    <Modal
      isOpen={true}
      onRequestClose={props.onClose}
      className="meal-dialog meal-dialog--form"
      overlayClassName="meal-dialog__overlay"
      aria={{ labelledby: "meal-form-title" }}
    >
      <div className="meal-dialog__header">
        <h2 id="meal-form-title">{isCreate ? "New meal" : "Edit meal"}</h2>
        <button
          type="button"
          className="meal-dialog__close"
          aria-label="Close without saving"
          onClick={props.onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="meal-dialog__body meal-form scroll-on-hover">
        {triedSave && hasErrors ? (
          <p role="alert" className="meal-form__summary">
            Fill in the fields marked below to save this meal.
          </p>
        ) : null}
        {props.saveError ? (
          <p role="alert" className="meal-form__summary">
            {props.saveError}
          </p>
        ) : null}

        <div className="meal-form__top">
          <div className="meal-form__field">
            <label htmlFor="meal-form-name">Meal name</label>
            <input
              id="meal-form-name"
              type="text"
              value={draft.display_name}
              aria-invalid={!!shown.display_name}
              aria-describedby="meal-form-name-error"
              className={shown.display_name ? "meal-form__invalid" : ""}
              onChange={(event) => update({ display_name: event.target.value })}
            />
            <span id="meal-form-name-error" className="meal-form__error">
              {shown.display_name}
            </span>
          </div>

          <fieldset className="meal-form__types" aria-describedby="meal-form-type-error">
            <legend>Meal type</legend>
            <div>
              {MEAL_CATEGORIES.map((category) => (
                <label
                  key={category.id}
                  className={
                    "meal-type--" +
                    category.id +
                    (draft.category === category.id ? " meal-form__type--on" : "")
                  }
                >
                  <input
                    type="radio"
                    name="meal-form-type"
                    value={category.id}
                    checked={draft.category === category.id}
                    onChange={() => update({ category: category.id })}
                  />
                  {category.label}
                </label>
              ))}
            </div>
            <span id="meal-form-type-error" className="meal-form__error">
              {shown.category}
            </span>
          </fieldset>
        </div>

        <div className="meal-form__field">
          <label htmlFor="meal-form-description">Description</label>
          <textarea
            id="meal-form-description"
            rows={3}
            value={draft.description}
            aria-invalid={!!shown.description}
            aria-describedby="meal-form-description-error"
            className={shown.description ? "meal-form__invalid" : ""}
            onChange={(event) => update({ description: event.target.value })}
          />
          <span id="meal-form-description-error" className="meal-form__error">
            {shown.description}
          </span>
        </div>

        <section aria-labelledby="meal-form-ingredients" className="meal-form__section">
          <h3 id="meal-form-ingredients">
            Ingredients{" "}
            {draft.ingredients.length ? <span>{draft.ingredients.length}</span> : null}
          </h3>
          {chips("ingredients", "Ingredients", "Remove ")}
          {listInput(
            "ingredients",
            "meal-form-ingredient",
            "Add an ingredient",
            "Add an ingredient, then press Enter",
            "Add"
          )}
        </section>

        <section aria-labelledby="meal-form-steps" className="meal-form__section">
          <h3 id="meal-form-steps">Instructions</h3>
          {draft.instructions.length ? (
            <ol aria-label="Instructions" className="meal-form__steps">
              {draft.instructions.map((step, index) => {
                const first = index === 0;
                const last = index === draft.instructions.length - 1;
                return (
                  <li key={index}>
                    <span aria-hidden="true" className="meal-form__step-number">
                      {index + 1}
                    </span>
                    <label htmlFor={"meal-form-step-" + index} className="meal-form__sr">
                      Step {index + 1}
                    </label>
                    <textarea
                      id={"meal-form-step-" + index}
                      rows={2}
                      value={step}
                      onChange={(event) => {
                        const steps = draft.instructions.slice();
                        steps[index] = event.target.value;
                        update({ instructions: steps });
                      }}
                    />
                    <div className="meal-form__step-moves">
                      <button
                        type="button"
                        aria-label={"Move step " + (index + 1) + " up"}
                        disabled={first}
                        onClick={() => moveStep(index, -1)}
                      >
                        <Chevron d="M6 15l6-6 6 6" />
                      </button>
                      <button
                        type="button"
                        aria-label={"Move step " + (index + 1) + " down"}
                        disabled={last}
                        onClick={() => moveStep(index, 1)}
                      >
                        <Chevron d="M6 9l6 6 6-6" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="meal-form__step-remove"
                      aria-label={"Remove step " + (index + 1)}
                      onClick={() => removeFrom("instructions", index)}
                    >
                      <TrashIcon />
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : null}
          {listInput(
            "instructions",
            "meal-form-step",
            "Add a step",
            "Add the next step, then press Enter",
            "Add step"
          )}
        </section>

        <section aria-labelledby="meal-form-tags" className="meal-form__section">
          <h3 id="meal-form-tags">Tags</h3>
          {chips("tags", "Tags", "Remove tag ")}
          {listInput("tags", "meal-form-tag", "Add a tag", "Add a tag, like quick or freezer", "Add")}
        </section>

        <p role="status" aria-live="polite" className="meal-form__sr">
          {announcement}
        </p>
      </div>

      <div className="meal-dialog__footer">
        <span className="meal-dialog__hint">
          Every field is needed before a meal can be saved.
        </span>
        <button type="button" className="meal-dialog__secondary" onClick={props.onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="meal-dialog__primary"
          disabled={props.saving}
          onClick={submit}
        >
          {props.saving ? "Saving…" : isCreate ? "Create meal" : "Save changes"}
        </button>
      </div>
    </Modal>
  );
};

export default MealForm;
