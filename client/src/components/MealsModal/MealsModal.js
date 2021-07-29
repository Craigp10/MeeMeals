import React, { useEffect, useState } from "react";
import "./MealsModal.css";
import Modal from "react-modal";
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
    meal_name: "",
    meal_ingredients: [],
    meal_description: "",
    meal_category: "",
    meal_instructions: [],
    meal_tags: [],
  });

  const [inputText, setInputText] = useState({
    meal_tags: "",
    meal_ingredients: "",
    meal_instructions: "",
  });

  const [validated, setValidation] = useState(false);

  const updateState = (e, field) => {
    const meal_data = mealData;
    meal_data[field] = e.target.value;
    setMealData({ ...meal_data });
  };

  useEffect(() => {
    //Sets initial state values if the modal is editing
    if (props.modalAction == "edit" || props.modalAction == "preview") {
      const meal_data = mealData;
      meal_data["meal_name"] = props.activeMeal.display_name;
      meal_data["meal_ingredients"] = props.activeMeal.ingredients;
      meal_data["meal_instructions"] = props.activeMeal.instructions;
      meal_data["meal_tags"] = props.activeMeal.tags;
      meal_data["meal_description"] = props.activeMeal.description;
      meal_data["meal_category"] = props.activeMeal.category;
      setMealData({ ...meal_data });
    }
  }, [props.show]);

  useEffect(() => {
    if (
      mealData["meal_name"] != "" &&
      mealData["meal_ingredients"]?.length != 0 &&
      mealData["meal_instructions"]?.length != 0 &&
      mealData["meal_tags"]?.length != 0 &&
      mealData["meal_description"] != "" &&
      mealData["meal_category"] != ""
    ) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  }, [mealData]);

  //validation logic... With character checjs

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
        <div className="meals-modal-content">
          {props.modalAction == "preview" ? (
            <>
              <div className="meals-modal-header">
                <span className="meals-modal-left"></span>
                <span className="meals-modal-title"> Preview Meal</span>
                <span
                  className="meals-modal-right glyphicon glyphicon-remove"
                  onClick={props.handleClose}
                ></span>
              </div>

              <div className="meals-modal-form">
                <div className="meals-modal-form-field">
                  <label>Meal Name</label>
                  <input
                    type="text"
                    id="meal_name"
                    value={mealData.meal_name}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal-form-field">
                  <label>Meal Description</label>
                  <input
                    type="text"
                    id="meal_description"
                    value={mealData.meal_description}
                    onChange={(e) => updateState(e, e.target.id)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal-form-field">
                  <label>Category: &nbsp;</label> <br />
                  <select
                    type="text"
                    id="meal_category"
                    value={mealData.meal_category}
                    onChange={(e) => updateState(e, e.target.id)}
                    disabled
                  >
                    <option value="">{mealData.meal_category}</option>
                  </select>
                </div>
                <div className="meals-modal-form-field">
                  <label>Ingredients</label>
                  <div className="extension">
                    {mealData.meal_ingredients.map((ingredient, idx) => (
                      <span className="tag" key={idx}>
                        {ingredient}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="meal_ingredients"
                    value={inputText.meal_ingredients}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal-form-field">
                  <label>Instructions</label>
                  <ol className="extension">
                    {mealData.meal_instructions.map((tag, idx) => (
                      <li className="instruction_tag" key={idx}>
                        {tag}
                      </li>
                    ))}
                  </ol>
                  <input
                    type="text"
                    id="meal_instructions"
                    value={inputText.meal_instructions}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="meals-modal-form-field">
                  <label>Tags</label>
                  <div className="extension">
                    {mealData.meal_tags.map((tag, idx) => (
                      <span className="tag" key={idx}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="meal_tags"
                    value={inputText.meal_tags}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    disabled
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="meals-modal-header">
                <span className="meals-modal-left"></span>
                {props.modalAction == "create" ? (
                  <span className="meals-modal-title"> New Meal</span>
                ) : (
                  <span className="meals-modal-title"> Edit Meal</span>
                )}
                <span
                  className="meals-modal-right glyphicon glyphicon-remove"
                  onClick={props.handleClose}
                ></span>
              </div>

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
                  <label>Category: &nbsp;</label> <br />
                  <select
                    type="text"
                    id="meal_category"
                    value={mealData.meal_category}
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
                <div className="meals-modal-form-field">
                  <label>Ingredients</label>
                  <div className="extension">
                    {mealData.meal_ingredients.map((ingredient, idx) => (
                      <span
                        className="tag"
                        key={idx}
                        onClick={(e) => removeTag("meal_ingredients", idx)}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="meal_ingredients"
                    value={inputText.meal_ingredients}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value != "") {
                        mealData["meal_ingredients"].push(e.target.value);
                        setMealData({ ...mealData });
                        updateText(e.target.id, "");
                      }
                    }}
                  />
                </div>
                <div className="meals-modal-form-field">
                  <label>Instructions</label>
                  <ol className="extension">
                    {mealData.meal_instructions.map((tag, idx) => (
                      <li className="instruction_tag" key={idx}>
                        {tag}
                      </li>
                    ))}
                  </ol>
                  <input
                    type="text"
                    id="meal_instructions"
                    value={inputText.meal_instructions}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value != "") {
                        mealData["meal_instructions"].push(e.target.value);
                        setMealData({ ...mealData });
                        updateText(e.target.id, "");
                      }
                    }}
                  />
                </div>
                <div className="meals-modal-form-field">
                  <label>Tags</label>
                  <div className="extension">
                    {mealData.meal_tags.map((tag, idx) => (
                      <span
                        className="tag"
                        key={idx}
                        onClick={() => removeTag("meal_tags", idx)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="meal_tags"
                    value={inputText.meal_tags}
                    onChange={(e) => updateText(e.target.id, e.target.value)}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value != "") {
                        mealData["meal_tags"].push(e.target.value);
                        setMealData({ ...mealData });
                        updateText(e.target.id, "");
                      }
                    }}
                  />
                </div>
              </div>
              <div className="meals-modal-btns">
                {props.modalAction == "create" ? (
                  <button
                    id="submit"
                    className={validated ? "" : "disabled"}
                    onClick={() => {
                      setMealData({
                        meal_name: "",
                        meal_ingredients: [],
                        meal_description: "",
                        meal_category: "select",
                        meal_instructions: [],
                        meal_tags: [],
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
                        meal_name: "",
                        meal_ingredients: [],
                        meal_description: "",
                        meal_category: "select",
                        meal_instructions: [],
                        meal_tags: [],
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
