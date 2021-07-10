import React, { useState, useEffect, useCallback } from "react";
import "./MealDrop.css";

const MealDrop = (props) => {
  console.log(props.meal);
  return (
    <div
      className={
        props.activeMealClick ? "mealdrop-wrapper active" : "mealdrop-wrapper"
      }
      onClick={() => props.mealClickCallback(props.index)}
    >
      {Object.keys(props.meal).length != 0 ? (
        <div className="mealdrop-content">
          <div className="mealdrop-content-header">
            <div className="mealdrop-content-displayname">
              {props.meal.display_name}
            </div>
            <span
              className="glyphicon glyphicon-remove"
              onClick={() => props.removeMeal(props.index)}
            ></span>
          </div>
        </div>
      ) : (
        <div className="mealdrop-content-no-meal"></div>
      )}
    </div>
  );
};

export default MealDrop;
