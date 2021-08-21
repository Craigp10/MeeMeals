import React, { useEffect, useState } from "react";
import "./MealBox.css";

const MealBox = (props:any) => {
  return (
    <div className="mealbox-wrapper glow">
      {!props.disable ? (
        <div className="mealbox__content">
          <div className="mealbox__content__header">
            <div className="mealbox__content__header-displayname">
              {props.meal.display_name}
            </div>
            <div className="mealbox__content__header-options">
              <span
                className="glyphicon glyphicon-resize-full"
                onClick={() => props.handleShow("preview", props.index)}
              ></span>
              &nbsp; &nbsp;
              <span
                className="glyphicon glyphicon-edit"
                onClick={() => props.handleShow("edit", props.index)}
              ></span>
              &nbsp; &nbsp;
              <span
                className="glyphicon glyphicon-trash"
                onClick={() => props.deleteMeal(props.meal._id)}
              ></span>
            </div>
          </div>
          <div className="mealbox__content__body">
            <div className="mealbox__content__body__description">
              <h6>Description</h6>
              {props.meal.description}
            </div>
            <div className="mealbox__content__body__ingredients">
              <h6>Ingredients</h6>
              {props.meal.ingredients.map((ingredient:string, idx:number) => {
                return (
                  <span
                    className="ingredient"
                    style={{ display: "block" }}
                    key={idx}
                  >
                    {ingredient}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mealbox__content__footer">
            <span>Created On: 7/6/21</span>
            <span>Last scheduled: 7/5/21</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MealBox;
