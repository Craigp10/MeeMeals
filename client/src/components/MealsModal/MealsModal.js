import React, { useEffect, useState } from "react";
import "./MealsModal.css";
import { Modal, Button, Form } from "react-bootstrap";

const tags = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const MealsModal = (props) => {
  const [mealData, setMealData] = useState({
    meal_name: "",
    meal_ingredients: "", //[],
    meal_description: "",
    meal_tag: "",
  });
  const [validated, setValidation] = useState(false);

  const updateState = (e, field) => {
    // console.log(e.target.value, field);
    const meal_data = mealData;
    meal_data[field] = e.target.value;
    setMealData({ ...meal_data });
  };

  useEffect(() => {
    if (
      mealData["meal_name"] != "" &&
      mealData["meal_ingredients"] != "" &&
      mealData["meal_description"] != "" &&
      mealData["meal_tag"] != ""
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
                {/* <form className="meals-modal-form"> */}
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
                  <label>Tag</label>
                  <input
                    type="text"
                    id="meal_tag"
                    value={mealData.meal_tag}
                    onChange={(e) => updateState(e, e.target.id)}
                  />
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
                    onClick={props.handleSubmit}
                  >
                    Create Meal
                  </button>
                  {/* <button onClick={() => setValidation(!validated)}></button> */}
                </div>
                {/* </form> */}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* <Modal
        show={props.show}
        onHide={() => props.handleClose()}
        animation={false}
        className="modal-wrapper"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Meal Name:</Form.Label>
            <Form.Control
              type="text"
              id="meal_title"
              onChange={(e) => updateState(e, e.target.id)}
              value={mealData.meal_title}
              placeholder="name input"
            />
            <Form.Label>Meal Ingredients:</Form.Label>
            <Form.Control
              type="text"
              id="meal_title"
              onChange={(e) => updateState(e, e.target.id)}
              value={mealData.meal_title}
              placeholder="name input"
            />
            <Form.Label>Meal Name:</Form.Label>
            <Form.Control
              type="text"
              id="meal_title"
              onChange={(e) => updateState(e, e.target.id)}
              value={mealData.meal_title}
              placeholder="name input"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            onClick={() => props.handleSubmit(mealData)}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default MealsModal;
