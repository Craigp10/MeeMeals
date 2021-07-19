import React, { useEffect, useState } from "react";
import "./MealsModal.css";
import Modal from "react-modal";
Modal.setAppElement("#root");

const categories = ["Breakfast", "Lunch", "Dinner", "Snacks"];
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const MealsModal = (props) => {
  const [mealData, setMealData] = useState({
    meal_name: "",
    meal_ingredients: "", //[],
    meal_description: "",
    meal_category: "select",
    meal_instructions: "",
    meal_tags: ["testing"],
  });
  const [inputText, setInputText] = useState({
    tag_text: "",
    ingredientsText: "",
    instructionsText: "",
  });

  const [validated, setValidation] = useState(false);

  const updateState = (e, field) => {
    const meal_data = mealData;
    meal_data[field] = e.target.value;
    setMealData({ ...meal_data });
  };

  useEffect(() => {
    if (
      mealData["meal_name"] != "" &&
      mealData["meal_ingredients"] != "" &&
      mealData["meal_description"] != "" &&
      mealData["meal_category"] != ""
    ) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  }, [mealData]);

  const removeTag = (idx) => {
    console.log("removing tag");
    const newMealData = mealData;
    newMealData["meal_tags"].splice(idx, 1);
    setMealData({ ...newMealData });
  };

  const updateText = (value, id) => {
    inputText[id] = value;
    setInputText({ ...inputText });
  };

  const addTag = (id) => {};

  console.log(mealData.meal_tags);
  return (
    <div>
      <Modal
        isOpen={props.show}
        onRequestClose={props.handleClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="meals-modal-content">
          <div className="meals-modal-header">
            <span className="meals-modal-left"></span>
            <span className="meals-modal-title">Create Meal</span>
            <span
              className="meals-modal-right glyphicon glyphicon-remove"
              onClick={props.handleClose}
            ></span>
          </div>

          <div className="meals-modal-body">
            <div className="meals-modal-form">
              <div className="meals-modal-form-field">
                <label>Meal Name</label>
                <input
                  type="text"
                  id="meal_name"
                  value={mealData.meal_name}
                  onChange={(e) => updateState(e, e.target.id)}
                  autoComplete="off"
                />
              </div>
              <div className="testing"></div>
              <div className="meals-modal-form-field">
                <label>Meal Description</label>
                <input
                  type="text"
                  id="meal_description"
                  value={mealData.meal_description}
                  onChange={(e) => updateState(e, e.target.id)}
                  autoComplete="off"
                />
              </div>
              <div className="meals-modal-form-field">
                <label>Category: &nbsp;</label>
                <select
                  type="text"
                  id="meal_category"
                  value={mealData.meal_category}
                  onChange={(e) => updateState(e, e.target.id)}
                >
                  <option value="select" disabled>
                    Select a Category
                  </option>
                  {categories.map((category, idx) => {
                    return (
                      <option value={category} key={idx}>
                        {category}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="meals-modal-form-field">
                <label>Ingredients</label>
                <div className="extension"></div>
                <input
                  type="text"
                  id="meal_ingredients"
                  value={mealData.meal_ingredients}
                  onChange={(e) => updateState(e, e.target.id)}
                  autoComplete="off"
                />
              </div>
              <div className="meals-modal-form-field tags">
                <label>Instructions</label>
                <div className="extension"></div>
                <input
                  type="text"
                  id="meal_instructions"
                  value={mealData.meal_instructions}
                  onChange={(e) => updateState(e, e.target.id)}
                  autoComplete="off"
                />
              </div>
              <div className="meals-modal-form-field">
                <label>Tags</label>
                <div className="extension">
                  {mealData.meal_tags.map((tag, idx) => (
                    <span
                      className="tag"
                      key={idx}
                      onClick={() => removeTag(idx)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  id="tag_text"
                  value={inputText.tagText}
                  onChange={(e) => updateText(e.target.id, e.target.value)}
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("ENTER");
                      // students[index].tags.push(e.currentTarget.value);
                      // students[index].tagInput = "";
                      // setStudents([...students]);
                    }
                  }}
                />
              </div>
            </div>
            <div className="meals-modal-btns">
              <button
                id="submit"
                className={validated ? "" : "disabled"}
                onClick={() => props.handleSubmit(mealData)}
              >
                Create Meal
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* {props.show ? (
        <div className="meals-modal-wrapper">
          <div className="meals-modal-content">
            <div className="meals-modal-header">
              <span className="meals-modal-left"></span>
              <span className="meals-modal-title">Create Meal</span>
              <span
                className="meals-modal-right glyphicon glyphicon-remove"
                onClick={props.handleClose}
              ></span>
            </div>

            <div className="meals-modal-body">
              <div className="meals-modal-form">
                <div className="meals-modal-form-field">
                  <label>Meal Name</label>
                  <input
                    type="text"
                    id="meal_name"
                    value={mealData.meal_name}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                  />
                </div>
                <div className="testing"></div>
                <div className="meals-modal-form-field">
                  <label>Meal Description</label>
                  <input
                    type="text"
                    id="meal_description"
                    value={mealData.meal_description}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                  />
                </div>
                <div className="meals-modal-form-field">
                  <label>Category: &nbsp;</label>
                  <select
                    type="text"
                    id="meal_category"
                    value={mealData.meal_category}
                    onChange={(e) => updateState(e, e.target.id)}
                  >
                    <option value="select" disabled>
                      Select a Category
                    </option>
                    {categories.map((category, idx) => {
                      return (
                        <option value={category} key={idx}>
                          {category}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="meals-modal-form-field">
                  <label>Ingredients</label>
                  <div className="tags-wrapper"></div>
                  <input
                    type="text"
                    id="meal_ingredients"
                    value={mealData.meal_ingredients}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                  />
                </div>
                <div className="meals-modal-form-field tags">
                  <label>Instructions</label>
                  <div className="tags-wrapper"></div>
                  <input
                    type="text"
                    id="meal_instructions"
                    value={mealData.meal_instructions}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                  />
                </div>
                <div className="meals-modal-form-field">
                  <label>Tags</label>
                  <div className="tags-wrapper"></div>
                  <input
                    type="text"
                    id="meal_ingredients"
                    value={mealData.meal_tags}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="meals-modal-btns">
                <button
                  id="submit"
                  className={validated ? "" : "disabled"}
                  onClick={() => props.handleSubmit(mealData)}
                >
                  Create Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null} */}
    </div>
  );
};

export default MealsModal;
