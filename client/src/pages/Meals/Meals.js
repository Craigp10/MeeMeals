import React, { useEffect, useState } from "react";
import "./Meals.css";
import apis from "../../api/index";
import MealBox from "../../components/MealBox/MealBox";

const Meals = () => {
  const [state, setState] = useState([]);

  useEffect(async () => {
    await apis.getAllMeals().then((resp) => setState(resp.data.data));
  }, []);

  return (
    <div className="meals-content-wrapper">
      <div className="meal-content-header">
        <h2>Your Meals</h2>
      </div>
      <div className="meals-content-board">
        <ul className="meals-content-mealboxes">
          {state.map((meal) => (
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
