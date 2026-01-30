"use client";

import { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "./MealsModal.module.scss";

const categories = ["Breakfast", "Lunch", "Dinner", "Snack"];

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#02203c",
    maxHeight: "90vh",
    overflow: "auto",
  },
  overlay: { zIndex: 1000 },
};

interface MealData {
  _id?: string;
  display_name: string;
  ingredients: string[];
  description: string;
  category: string;
  instructions: string[];
  tags: string[];
}

interface Props {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (data: MealData) => void;
  modalAction: string;
  mealData?: MealData;
}

export default function MealsModal({
  show,
  handleClose,
  handleSubmit,
  modalAction,
  mealData: initialMealData,
}: Props) {
  const [mealData, setMealData] = useState<MealData>({
    display_name: "",
    ingredients: [],
    description: "",
    category: "",
    instructions: [],
    tags: [],
  });

  const [inputText, setInputText] = useState({
    tags: "",
    ingredients: "",
    instructions: "",
  });

  const [validated, setValidation] = useState(false);

  useEffect(() => {
    if ((modalAction === "edit" || modalAction === "preview") && initialMealData) {
      setMealData({ ...initialMealData });
    }
  }, [modalAction, initialMealData]);

  useEffect(() => {
    const isValid =
      mealData.display_name !== "" &&
      mealData.ingredients.length > 0 &&
      mealData.instructions.length > 0 &&
      mealData.tags.length > 0 &&
      mealData.description !== "" &&
      mealData.category !== "";
    setValidation(isValid);
  }, [mealData]);

  const updateState = (field: keyof MealData, value: string) => {
    setMealData((prev) => ({ ...prev, [field]: value }));
  };

  const removeTag = (field: "ingredients" | "tags" | "instructions", idx: number) => {
    setMealData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  const addTag = (field: "ingredients" | "tags" | "instructions", value: string) => {
    if (value.trim()) {
      setMealData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setInputText((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "ingredients" | "tags" | "instructions"
  ) => {
    if (e.key === "Enter" && inputText[field]) {
      e.preventDefault();
      addTag(field, inputText[field]);
    }
  };

  const isPreview = modalAction === "preview";
  const title =
    modalAction === "create"
      ? "New Meal"
      : modalAction === "edit"
      ? "Edit Meal"
      : "Preview Meal";

  return (
    <Modal
      isOpen={show}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel="Meal Modal"
      ariaHideApp={false}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.headerLeft} />
          <span className={styles.headerTitle}>{title}</span>
          <span
            className={`${styles.headerRight} glyphicon glyphicon-remove`}
            onClick={handleClose}
          />
        </div>

        <div className={styles.form}>
          <div className={styles.formField}>
            <label>Meal Name</label>
            <input
              type="text"
              value={mealData.display_name}
              onChange={(e) => updateState("display_name", e.target.value)}
              autoComplete="off"
              disabled={isPreview}
            />
          </div>

          <div className={styles.formField}>
            <label>Meal Description</label>
            <textarea
              value={mealData.description}
              onChange={(e) => updateState("description", e.target.value)}
              autoComplete="off"
              disabled={isPreview}
            />
          </div>

          <div className={styles.formField}>
            <label>Category</label>
            <select
              value={mealData.category}
              onChange={(e) => updateState("category", e.target.value)}
              disabled={isPreview}
            >
              <option value="" disabled>
                Select a Category
              </option>
              {categories.map((category, idx) => (
                <option value={category.toLowerCase()} key={idx}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formField}>
            <label>
              Ingredients
              {!isPreview && (
                <span className={styles.hint}>(Press Enter to add, click to remove)</span>
              )}
            </label>
            <div className={styles.extension}>
              {mealData.ingredients.map((ingredient, idx) => (
                <span
                  className={styles.tag}
                  key={idx}
                  onClick={() => !isPreview && removeTag("ingredients", idx)}
                >
                  {ingredient}
                </span>
              ))}
            </div>
            <input
              type="text"
              value={inputText.ingredients}
              onChange={(e) =>
                setInputText((prev) => ({ ...prev, ingredients: e.target.value }))
              }
              onKeyDown={(e) => handleKeyDown(e, "ingredients")}
              autoComplete="off"
              disabled={isPreview}
              placeholder="Type and press Enter"
            />
          </div>

          <div className={styles.formField}>
            <label>
              Instructions
              {!isPreview && (
                <span className={styles.hint}>(Press Enter to add, click to remove)</span>
              )}
            </label>
            <ol className={styles.instructionExtension}>
              {mealData.instructions.map((instruction, idx) => (
                <li
                  className={styles.instructionTag}
                  key={idx}
                  onClick={() => !isPreview && removeTag("instructions", idx)}
                >
                  {instruction}
                </li>
              ))}
            </ol>
            <input
              type="text"
              value={inputText.instructions}
              onChange={(e) =>
                setInputText((prev) => ({ ...prev, instructions: e.target.value }))
              }
              onKeyDown={(e) => handleKeyDown(e, "instructions")}
              autoComplete="off"
              disabled={isPreview}
              placeholder="Type and press Enter"
            />
          </div>

          <div className={styles.formField}>
            <label>
              Tags
              {!isPreview && (
                <span className={styles.hint}>(Press Enter to add, click to remove)</span>
              )}
            </label>
            <div className={styles.extension}>
              {mealData.tags.map((tag, idx) => (
                <span
                  className={styles.tag}
                  key={idx}
                  onClick={() => !isPreview && removeTag("tags", idx)}
                >
                  {tag}
                </span>
              ))}
            </div>
            <input
              type="text"
              value={inputText.tags}
              onChange={(e) =>
                setInputText((prev) => ({ ...prev, tags: e.target.value }))
              }
              onKeyDown={(e) => handleKeyDown(e, "tags")}
              autoComplete="off"
              disabled={isPreview}
              placeholder="Type and press Enter"
            />
          </div>
        </div>

        {!isPreview && (
          <div className={styles.btns}>
            <button
              className={validated ? "" : styles.disabled}
              onClick={() => handleSubmit(mealData)}
              disabled={!validated}
            >
              {modalAction === "create" ? "Create Meal" : "Save Meal"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
