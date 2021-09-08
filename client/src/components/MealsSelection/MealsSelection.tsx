import React, { FC, useState, useEffect, useContext } from "react";
import { userContext, windowSizeContext } from "../../App";
import "./scss/compiled.scss";

type meal = {
  category: string;
  date_created: string;
  description: string;
  display_name: string;
  ingredients: string[];
  instructions: string[];
  isActive: boolean;
  tags: string[];
  _id: string;
};

interface Props {
  meals: meal[];
  activeMeal: boolean;
  handleMealClick: (mealId: string) => void;
  showSelection: boolean;
  categoryFilter: string;
  searchFilter: string;
  isMobileView: boolean;
}

const MealSelection = (props: Props) => (
  <div className="meal-selection-wrapper">
    <div className="meal-selection-content__selection">
      <div className="meal-selection-content__selection-scroll">
        {props.meals
          .filter((meal: meal) => {
            if (props.categoryFilter == "all") {
              const mealData = [
                meal.display_name,
                ...meal.tags.map((tag) => tag),
                ...meal.ingredients.map((ingredient) => ingredient),
              ];
              return mealData
                .join(" ")
                .toLowerCase()
                .includes(props.searchFilter.toLowerCase());
            } else {
              const mealData = [
                meal.display_name,
                ...meal.tags.map((tag: string) => tag),
                ...meal.ingredients.map((ingredient) => ingredient),
              ];
              return (
                mealData
                  .join(" ")
                  .toLowerCase()
                  .includes(props.searchFilter.toLowerCase()) &&
                meal.category == props.categoryFilter
              );
            }
          })
          .map((meal: meal, index: number) => {
            return (
              <div
                key={index}
                className="meal-selection__selection__meal-wrapper"
              >
                <div
                  className="meal-selection__selection__meal"
                  onClick={() => props.handleMealClick(meal._id)}
                >
                  <div className="meal-selection__selection__meal-header">
                    <div className="meal-selection__selection__meal-displayname">
                      {meal.display_name}
                    </div>
                  </div>
                  <div className="meal-selection__selection__meal-body">
                    <label>Ingredients</label>
                    <div className="meal-selection__selection__meal-tags">
                      {meal.ingredients.map(
                        (ingredients: string, idx: number) => (
                          <span className="__meal-tag" key={idx}>
                            {ingredients}
                          </span>
                        )
                      )}
                    </div>
                    <hr />
                    <label>Tags</label>
                    <div className="meal-selection__selection__meal-tags">
                      {meal.tags.map((tag: string, idx: number) => (
                        <span className="__meal-tag" key={idx}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  </div>
);

export default MealSelection;
