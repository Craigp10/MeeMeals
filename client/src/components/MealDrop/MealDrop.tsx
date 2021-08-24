import React, { useState, useEffect, useCallback } from "react";
import "./MealDrop.css";

const MealDrop = (props: any) => {
  console.log(props.activeMealIsActive);
  return (
    <div
      className={
        props.activeMealIsActive
          ? "mealdrop-wrapper active"
          : "mealdrop-wrapper"
      }
      // @ts-ignore
      onClick={
        props.activeMealIsActive
          ? () => props.mealClickCallback(props.index)
          : null
      }
    >
      {Object.keys(props.meal).length != 0 ? (
        <div className="mealdrop__content">
          <div className="mealdrop__content__header">
            <div className="mealdrop__content__header-displayname">
              {props.meal.display_name}
            </div>
            <div className="mealdrop__content__header-options">
              <span
                className="glyphicon glyphicon-remove"
                onClick={() => props.removeMeal(props.index)}
              ></span>
            </div>
          </div>
          <div className="mealdrop__content__body">
            {props.meal.description}
          </div>
          <div className="mealdrop__content__footer">
            <span>Created On: {props.meal.date_created}</span>
            <span>Last scheduled: 7/5/21</span>
          </div>
        </div>
      ) : (
        <div className="mealdrop__content-no-meal"></div>
      )}
    </div>
  );
};

export default MealDrop;
