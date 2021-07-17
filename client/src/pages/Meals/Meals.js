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
  const handleSubmit = (data) => {
    console.log("submiting data", data);
  };
  console.log(show);
  return (
    <div className="meals-content-wrapper">
      <div className="meal-content-header">
        <h2>Your Meals</h2>
      </div>
      <MealsModal
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
      <div className="meals-content-board">
        <button type="button" onClick={handleShow}>
          Launch modal
        </button>

        <ul className="meals-content-mealboxes">
          {meals.map((meal) => (
            <li key={meal._id}>
              <MealBox meal={meal} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Meals;
