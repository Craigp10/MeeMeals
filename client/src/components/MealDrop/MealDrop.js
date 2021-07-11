import React, { useState, useEffect, useCallback } from "react";
import "./MealDrop.css";

const MealDrop = (props) => {
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
          <p>{props.meal.description}</p>

          <div className="mealdrop-content-footer">
            <span>Created On: 7/6/21</span>
            <span>Last scheduled: 7/5/21</span>
          </div>
        </div>
      ) : (
        <div className="mealdrop-content-no-meal"></div>
      )}
    </div>
  );
};

export default MealDrop;
