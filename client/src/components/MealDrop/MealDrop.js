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
      {props.meal ? (
        <div className="mealdrop-content-header">
          <div className="mealdrop-content-displayname">
            {props.meal.display_name}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MealDrop;
