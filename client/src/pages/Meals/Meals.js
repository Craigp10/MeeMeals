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
  useEffect(async () => {
    await apis.getUserMeals().then((resp) => setMeals(resp.data.meals));
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(!show);
  const handleSubmit = async (data) => {
    console.log("submiting data", data);
    const requestObj = {
      meal: data,
      user_id: "60f336e85744947fcf6db8fe",
    };

    await apis
      .createNewMeal(requestObj)
      .then((resp) => setMeals(resp.data.meals));
  };

  console.log(show);

  return (
    <div className="meals-content-wrapper">
      <MealsModal
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
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
            <button type="button" onClick={handleShow}>
              Create A Meal
            </button>
          </div>
        </div>
        <div className="meals-board-scroll">
          <ul className="meals-content-mealboxes">
            {meals.map((meal) => (
              <li key={meal._id}>
                <MealBox meal={meal} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Meals;
