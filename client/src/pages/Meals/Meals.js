import React, { useEffect, useState } from "react";
import "./Meals.css";
import apis from "../../api/meals";
import MealBox from "../../components/MealBox/MealBox";

const Meals = () => {
  const [state, setState] = useState([]);

  useEffect(async () => {
    await apis.getAllMeals().then((resp) => setState(resp.data.data));
  }, []);

  return (
    <div className="meals-content-wrapper">
      <div className="meals-content-board">
        <h2>Welcome to Meals Page!</h2>
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
