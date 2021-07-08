import React, { useEffect, useState } from "react";
import "./MealBox.css";

const MealBox = (props) => {
  console.log(props);
  return (
    <div className="mealbox-wrapper grow">
      <div className="mealbox-content-header">
        <div className="mealbox-content-displayname">
          {props.meal.display_name}
        </div>
        <div className="mealbox-content-header-options">
          <span className="glyphicon glyphicon-edit"></span>
          <span className="glyphicon glyphicon-trash"></span>
        </div>
      </div>
      <div className="mealbox-content-ingredients"></div>
      <div className="mealbox-content-description">
        {/* {props.meal.ingredients.map((ingredient, idx) => {
            return (
              <span
                className="ingredient"
                style={{ display: "block" }}
                key={idx}
              >
                {ingredient} a
              </span>
            );
          })} */}
        {props.meal.description}
      </div>
      <div className="mealbox-content-footer">
        <span>Created On: 7/6/21</span>
        <span>Last scheduled: 7/5/21</span>
      </div>
    </div>
  );
};

export default MealBox;
