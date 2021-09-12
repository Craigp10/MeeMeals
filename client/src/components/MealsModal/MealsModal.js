import React, { useEffect, useState } from "react";
import "./scss/compiled.scss";
import Modal from "react-modal";
import DragDropTags from "../DragDropTags/DragDropTags";
Modal.setAppElement("#root");

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
  },
  overlay: { zIndex: 1000 },
};

const MealsModal = (props) => {
  const [mealData, setMealData] = useState({
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

  const updateState = (e, field) => {
    const newMealData = mealData;
    newMealData[field] = e.target.value;
    setMealData({ ...newMealData });
  };

  const deleteInstructions = (index) => {
    console.log(index);
    const newMealData = mealData;
    console.log(newMealData);
    newMealData.instructions.splice(index, 1);
    console.log(newMealData);
    setMealData({ ...newMealData });
  };

  useEffect(() => {
    //Sets initial state values if the modal is editing
    if (props.modalAction == "edit" || props.modalAction == "preview") {
      const newMealData = props.mealData; //mealData;

      setMealData({ ...newMealData });
    }
  }, []);

  useEffect(() => {
    if (
      mealData["display_name"] != "" &&
      mealData["ingredients"]?.length != 0 &&
      mealData["instructions"]?.length != 0 &&
      mealData["tags"]?.length != 0 &&
      mealData["description"] != "" &&
      mealData["category"] != ""
    ) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  }, [mealData]);

  const reorderInstructions = (newOrder) => {
    const newMealData = mealData;
    newMealData.instructions = newOrder;
    setMealData({ ...newMealData });
  };

  const removeTag = (id, idx) => {
    mealData[id].splice(idx, 1);
    setMealData({ ...mealData });
  };

  const updateText = (id, value) => {
    inputText[id] = value;
    setInputText({ ...inputText });
  };
  return (
    <div>
      <Modal
        isOpen={props.show}
        onRequestClose={props.handleClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="meals-modal__content">
          {props.modalAction == "preview" ? (
            <>
              <div className="meals-modal__content__header">
                <span className="meals-modal__content__header-left"></span>
                <span className="meals-modal__content__header-title">
                  {" "}
                  Preview Meal
                </span>
                <span
                  className="meals-modal__content__header-right glyphicon glyphicon-remove"
                  onClick={props.handleClose}
                ></span>
              </div>

              <div className="meals-modal__content__form">
                <div className="meals-modal__content__form-field">
                  <label>Meal Name</label>
                  <input
                    type="text"
                    id="display_name"
                    value={mealData.display_name}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Meal Description</label>
                  <textarea
                    type="text"
                    id="description"
                    value={mealData.description}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Category: &nbsp;</label> <br />
                  <select
                    type="text"
                    id="category"
                    value={mealData.category}
                    onChange={(e) => updateState(e, e.target.id)}
                    disabled
                    style={{ appearance: "none" }}
                  >
                    <option value="">{mealData.category}</option>
                  </select>
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Ingredients</label>
                  <div className="extension">
                    {mealData.ingredients.map((ingredient, idx) => (
                      <span className="tag" key={idx}>
                        {ingredient}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="ingredients"
                    value={inputText.ingredients}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Instructions</label>
                  <ol className="instruction-extension">
                    {mealData.instructions.map((tag, idx) => (
                      <li className="instruction-tag" key={idx}>
                        {tag}
                      </li>
                    ))}
                  </ol>
                  <input
                    type="text"
                    id="instructions"
                    value={inputText.instructions}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Tags</label>
                  <div className="extension">
                    {mealData.tags.map((tag, idx) => (
                      <span className="tag" key={idx}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="tags"
                    value={inputText.tags}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    disabled
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="meals-modal__content__header">
                <span className="meals-modal__content__header-left"></span>
                {props.modalAction == "create" ? (
                  <span className="meals-modal__content__header-title">
                    {" "}
                    New Meal
                  </span>
                ) : (
                  <span className="meals-modal__content__header-title">
                    {" "}
                    Edit Meal
                  </span>
                )}
                <span
                  className="meals-modal__content__header-right glyphicon glyphicon-remove"
                  onClick={props.handleClose}
                ></span>
              </div>

              <div className="meals-modal__content__form">
                <div className="meals-modal__content__form-field">
                  <label>Meal Name</label>
                  <input
                    type="text"
                    id="display_name"
                    value={mealData.display_name}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Meal Description</label>
                  <textarea
                    // type="text"
                    id="description"
                    value={mealData.description}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Category: &nbsp;</label> <br />
                  <select
                    type="text"
                    id="category"
                    value={mealData.category}
                    onChange={(e) => updateState(e, e.target.id)}
                  >
                    <option value="" disabled>
                      Select a Category
                    </option>
                    {categories.map((category, idx) => {
                      return (
                        <option value={category.toLowerCase()} key={idx}>
                          {category}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="meals-modal__content__form-field">
                  <label>
                    Ingredients{" "}
                    <p style={{ display: "inline", fontSize: ".8rem" }}>
                      &nbsp;(Click tag to remove it.)
                    </p>
                  </label>
                  <div className="extension">
                    {mealData.ingredients.map((ingredient, idx) => (
                      <span
                        className="tag"
                        key={idx}
                        onClick={(e) => removeTag("ingredients", idx)}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="ingredients"
                    value={inputText.ingredients}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value != "") {
                        mealData["ingredients"].push(e.target.value);
                        setMealData({ ...mealData });
                        updateText(e.target.id, "");
                      }
                    }}
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>
                    Instructions &nbsp;
                    <p style={{ display: "inline", fontSize: ".8rem" }}>
                      (Drag and drop to reorganize steps.)
                    </p>
                  </label>
                  <DragDropTags
                    instructions={mealData.instructions}
                    reorderInstructions={reorderInstructions}
                    handleDeleteClick={deleteInstructions}
                  />
                  <input
                    type="text"
                    id="instructions"
                    value={inputText.instructions}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value != "") {
                        mealData["instructions"].push(e.target.value);
                        setMealData({ ...mealData });
                        updateText(e.target.id, "");
                      }
                    }}
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>
                    Tags{" "}
                    <p style={{ display: "inline", fontSize: ".8rem" }}>
                      &nbsp; (Click tag to remove it.)
                    </p>
                  </label>
                  <div className="extension">
                    {mealData.tags.map((tag, idx) => (
                      <span
                        className="tag"
                        key={idx}
                        onClick={() => removeTag("tags", idx)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="tags"
                    value={inputText.tags}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value != "") {
                        mealData["tags"].push(e.target.value);
                        setMealData({ ...mealData });
                        updateText(e.target.id, "");
                      }
                    }}
                  />
                </div>
              </div>
              <div className="meals-modal__content-btns">
                {props.modalAction == "create" ? (
                  <button
                    id="submit"
                    className={validated ? "" : "disabled"}
                    onClick={() => {
                      setMealData({
                        display_name: "",
                        ingredients: [],
                        description: "",
                        category: "select",
                        instructions: [],
                        tags: [],
                      });
                      props.handleSubmit(mealData);
                    }}
                    disabled={!validated}
                  >
                    Create Meal
                  </button>
                ) : (
                  <button
                    id="submit"
                    className={validated ? "" : "disabled"}
                    onClick={() => {
                      setMealData({
                        display_name: "",
                        ingredients: [],
                        description: "",
                        category: "select",
                        instructions: [],
                        tags: [],
                      });
                      props.handleSubmit(mealData);
                    }}
                    disabled={!validated}
                  >
                    Save Meal
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MealsModal;
