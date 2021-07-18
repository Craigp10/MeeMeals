import React, { useEffect, useState } from "react";
import "./Meals.css";
import apis from "../../api/index";
import MealBox from "../../components/MealBox/MealBox";
import { Modal, Button, Form } from "react-bootstrap";
import MealsModal from "../../components/MealsModal/MealsModal";
import "bootstrap/dist/css/bootstrap.min.css";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  useEffect(async () => {
    await apis
      .getUserMeals({ user_id: "60f4ade2701e6011d2b9329c" })
      .then((resp) => setMeals(resp.data.meals));
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = (action) => {
    setModalAction(action);
    setShow(!show);
  };
  const handleSubmit = async (data) => {
    console.log("submitting data", data);
    const requestObj = {
      meal: data,
      user_id: "60f4ade2701e6011d2b9329c",
    };

    await apis
      .createNewMeal(requestObj)
      .then((resp) => setMeals(resp.data.meals));
  };

  const handleDelete = async (meal_id) => {
    //const userDoubleCheck await doubleCheckDeletePopup()
    // if (!userDoubleCheck) return;
    const requestObj = {
      meal_id,
      user_id: "60f4ade2701e6011d2b9329c",
    };
    await apis.deleteMeal(requestObj).then((resp) => setMeals(resp.data.meals));
  };

  console.log(show);

  return (
    <div className="meals-content-wrapper">
      <MealsModal
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        modalAction={modalAction}
      />
      <div className="meals-content-board">
        <div className="meals-board-header">
          <div>
            {/* <saveComponentHandler/> */}
            Save message
          </div>
          <div>
            <h2>Your Meals</h2>
          </div>
          <div>
            <button type="button" onClick={() => handleShow("create")}>
              Create A Meal
            </button>
          </div>
        </div>
        <div className="meals-board-scroll">
          <ul className="meals-content-mealboxes">
            {meals.map((meal) => (
              <li key={meal._id}>
                <MealBox
                  meal={meal}
                  deleteMeal={handleDelete}
                  handleShow={handleShow}
                  disable={show}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Meals;
