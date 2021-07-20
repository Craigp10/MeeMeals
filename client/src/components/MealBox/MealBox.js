import React, { useEffect, useState } from "react";
import "./MealBox.css";

const MealBox = (props) => {
  return (
    <div className="mealbox-wrapper glow">
      {!props.disable ? (
        <div className="mealbox-content">
          <div className="mealbox-content-header">
            <div className="mealbox-content-displayname">
              {props.meal.display_name}
            </div>
            <div className="mealbox-content-header-options">
              <span
                className="glyphicon glyphicon-edit"
                onClick={() => props.handleShow("edit", props.index)}
              ></span>
              <span
                className="glyphicon glyphicon-trash"
                onClick={() => props.deleteMeal(props.meal._id)}
              ></span>
            </div>
          </div>
          <div className="mealbox-content-body">
            <div className="mealbox-content-ingredients"></div>
            <div className="mealbox-content-description">
              {/* {props.meal.ingredients.map((ingredient, idx) => {
          return (
            <span
              className="ingredient"
              style={{ display: "block" }}
              key={idx}
            >
              {ingredient}
            </span>
          );
        })} */}
              {props.meal.description}
            </div>
          </div>
          <div className="mealbox-content-footer">
            <span>Created On: 7/6/21</span>
            <span>Last scheduled: 7/5/21</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MealBox;
