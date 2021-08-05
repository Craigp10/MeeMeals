import React, { useState, useEffect, useCallback } from "react";
import "./SelectionFilter.css";

const CATEGORY_FILTERS = [
  {
    id: "all",
    text: "All",
    isActive: true,
  },
  {
    id: "breakfast",
    text: "Breakfast",
    isActive: false,
  },
  {
    id: "lunch",
    text: "Lunch",
    isActive: false,
  },
  {
    id: "dinner",
    text: "Dinner",
    isActive: false,
  },
  {
    id: "snack",
    text: "Snack",
    isActive: false,
  },
];

const SelectionFilter = (props) => {
  return (
    <div className="selection-filter-wrapper">
      {CATEGORY_FILTERS.map((category, index) => {
        return (
          <span
            key={index}
            className={
              props.categoryFilter == category.id
                ? "filterBtn activeCate"
                : "filterBtn"
            }
            id={category.id}
            onClick={() => props.setCategoryFilter(category.id)}
          >
            {category.text}
          </span>
        );
      })}
      <span className="glyphicon glyphicon-search">
        <input
          id="search"
          value={props.searchFilter}
          placeholder="Search by name, ingredients and tags"
          onChange={(e) => props.setSearchFilter(e.target.value)}
          autoComplete={"off"}
        />
      </span>
    </div>
  );
};

export default SelectionFilter;
