import React, { useEffect, useState } from "react";
import "./Meals.css";
import apis from "../../api/index";
import MealBox from "../../components/MealBox/MealBox";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(async () => {
    await apis.getUserMeals().then((resp) => setMeals(resp.data.meals));
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(show);
  return (
    <div className="meals-content-wrapper">
      <div className="meal-content-header">
        <h2>Your Meals</h2>
      </div>
      <div className="meals-content-board">
        <button type="button" onClick={handleShow}>
          Launch modal
        </button>
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
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
