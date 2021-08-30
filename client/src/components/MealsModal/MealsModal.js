import React, { useEffect, useState } from "react";
import "./MealsModal.scss";
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
};

const MealsModal = (props) => {
  const [mealData, setMealData] = useState({
    mealName: "",
    mealIngredients: [],
    mealDescription: "",
    mealCategory: "",
    mealInstructions: [],
    mealTags: [],
  });

  const [inputText, setInputText] = useState({
    mealTags: "",
    mealIngredients: "",
    mealInstructions: "",
  });

  const [validated, setValidation] = useState(false);

  const updateState = (e, field) => {
    const newMealData = mealData;
    newMealData[field] = e.target.value;
    setMealData({ ...newMealData });
  };

  useEffect(() => {
    //Sets initial state values if the modal is editing
    if (props.modalAction == "edit" || props.modalAction == "preview") {
      const newMealData = mealData;
      newMealData["mealName"] = props.mealData.display_name;
      newMealData["mealIngredients"] = props.mealData.ingredients;
      newMealData["mealInstructions"] = props.mealData.instructions;
      newMealData["mealTags"] = props.mealData.tags;
      newMealData["mealDescription"] = props.mealData.description;
      newMealData["mealCategory"] = props.mealData.category;
      setMealData({ ...newMealData });
    }
  }, []);

  useEffect(() => {
    if (
      mealData["mealName"] != "" &&
      mealData["mealIngredients"]?.length != 0 &&
      mealData["mealInstructions"]?.length != 0 &&
      mealData["mealTags"]?.length != 0 &&
      mealData["mealDescription"] != "" &&
      mealData["mealCategory"] != ""
    ) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  }, [mealData]);

  const reorderInstructions = (newOrder) => {
    const newMealData = mealData;
    newMealData.mealInstructions = newOrder;
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
  console.log("mealData", mealData);
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
                    id="mealName"
                    value={mealData.mealName}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Meal Description</label>
                  <textarea
                    type="text"
                    id="mealDescription"
                    value={mealData.mealDescription}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Category: &nbsp;</label> <br />
                  <select
                    type="text"
                    id="mealCategory"
                    value={mealData.mealCategory}
                    onChange={(e) => updateState(e, e.target.id)}
                    disabled
                    style={{ appearance: "none" }}
                  >
                    <option value="">{mealData.mealCategory}</option>
                  </select>
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Ingredients</label>
                  <div className="extension">
                    {mealData.mealIngredients.map((ingredient, idx) => (
                      <span className="tag" key={idx}>
                        {ingredient}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="mealIngredients"
                    value={inputText.mealIngredients}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Instructions</label>
                  <ol className="instruction-extension">
                    {mealData.mealInstructions.map((tag, idx) => (
                      <li className="instruction-tag" key={idx}>
                        {tag}
                      </li>
                    ))}
                  </ol>
                  <input
                    type="text"
                    id="mealInstructions"
                    value={inputText.mealInstructions}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Tags</label>
                  <div className="extension">
                    {mealData.mealTags.map((tag, idx) => (
                      <span className="tag" key={idx}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="mealTags"
                    value={inputText.mealTags}
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
                    id="mealName"
                    value={mealData.mealName}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Meal Description</label>
                  <textarea
                    // type="text"
                    id="mealDescription"
                    value={mealData.mealDescription}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                  />
                </div>
                <div className="meals-modal__content__form-field">
                  <label>Category: &nbsp;</label> <br />
                  <select
                    type="text"
                    id="mealCategory"
                    value={mealData.mealCategory}
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
                    {mealData.mealIngredients.map((ingredient, idx) => (
                      <span
                        className="tag"
                        key={idx}
                        onClick={(e) => removeTag("mealIngredients", idx)}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="mealIngredients"
                    value={inputText.mealIngredients}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value != "") {
                        mealData["mealIngredients"].push(e.target.value);
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
                    instructions={mealData.mealInstructions}
                    reorderInstructions={reorderInstructions}
                  />
                  <input
                    type="text"
                    id="mealInstructions"
                    value={inputText.mealInstructions}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value != "") {
                        mealData["mealInstructions"].push(e.target.value);
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
                    {mealData.mealTags.map((tag, idx) => (
                      <span
                        className="tag"
                        key={idx}
                        onClick={() => removeTag("mealTags", idx)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="mealTags"
                    value={inputText.mealTags}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value != "") {
                        mealData["mealTags"].push(e.target.value);
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
                        mealName: "",
                        mealIngredients: [],
                        mealDescription: "",
                        mealCategory: "select",
                        mealInstructions: [],
                        mealTags: [],
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
                        mealName: "",
                        mealIngredients: [],
                        mealDescription: "",
                        mealCategory: "select",
                        mealInstructions: [],
                        mealTags: [],
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
