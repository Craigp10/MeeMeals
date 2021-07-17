import React, { useEffect, useState } from "react";
import "./MealsModal.css";
import { Modal, Button, Form } from "react-bootstrap";

const categories = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const MealsModal = (props) => {
  const [mealData, setMealData] = useState({
    meal_name: "",
    meal_ingredients: "", //[],
    meal_description: "",
    meal_category: "select",
  });

  const [validated, setValidation] = useState(false);

  const updateState = (e, field) => {
    //console.log(e.target.value, field);
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
      console.log(true);
      setValidation(true);
    } else {
      setValidation(false);
    }
  }, [mealData]);

  console.log("mealData", mealData);
  console.log("validated", validated);
  return (
    <div>
      {props.show ? (
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
                  />
                </div>
                <div className="meals-modal-form-field">
                  <label>Meal Description</label>
                  <input
                    type="text"
                    id="meal_description"
                    value={mealData.meal_description}
                    onChange={(e) => updateState(e, e.target.id)}
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
                      return <option value={idx}>{category}</option>;
                    })}
                  </select>
                </div>
                <div className="meals-modal-form-field">
                  <label>Ingredients</label>
                  <div className="ingredient-tags-wrapper"></div>
                  <input
                    type="text"
                    id="meal_ingredients"
                    value={mealData.meal_ingredients}
                    onChange={(e) => updateState(e, e.target.id)}
                  />
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
        </div>
      ) : null}
    </div>
  );
};

export default MealsModal;
