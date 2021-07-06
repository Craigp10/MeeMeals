import React, { useEffect, useState } from "react";
import "./MealBox.css";

const MealBox = (props) => {
  console.log(props);
  return (
    <div className="mealbox-wrapper">
      <div className="mealbox-content">
        <div className="mealbox-content-header">
          <div className="mealbox-content-displayname">
            {props.meal.display_name}
          </div>
          <div className="mealbox-content-header-options">
            <span className="glyphicon glyphicon-edit"></span>
            <span className="glyphicon glyphicon-trash"></span>
          </div>
        </div>
        <div className="mealbox-content-ingredients">
          {props.meal.ingredients.map((ingredient, idx) => {
            return (
              <span
                className="ingredient"
                style={{ display: "block" }}
                key={idx}
              >
                {ingredient} a
              </span>
            );
          })}
          {props.meal.description}
        </div>

        <div className="mealbox-content-footer">Footer</div>
      </div>
    </div>
  );
};

export default MealBox;
