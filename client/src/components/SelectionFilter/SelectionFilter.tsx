import React from "react";
import "./SelectionFilter.scss";

const CATEGORY_FILTERS: { id: string; text: string }[] = [
  { id: "all", text: "All" },
  { id: "breakfast", text: "Breakfast" },
  { id: "lunch", text: "Lunch" },
  { id: "dinner", text: "Dinner" },
  { id: "snack", text: "Snack" },
];

interface Props {
  setCategoryFilter(id: string): void;
  setSearchFilter(searchFilter: string): void;
  categoryFilter: string;
  searchFilter: string;
}

const SelectionFilter = (props: Props) => (
  <div className="selection-filter-wrapper">
    <div
      role="group"
      aria-label="Filter by category"
      className="selection-filter__categories"
    >
      {CATEGORY_FILTERS.map((category) => (
        <button
          type="button"
          key={category.id}
          id={category.id}
          className={
            props.categoryFilter === category.id
              ? "filterBtn activeCate"
              : "filterBtn"
          }
          aria-pressed={props.categoryFilter === category.id}
          onClick={() => props.setCategoryFilter(category.id)}
        >
          {category.text}
        </button>
      ))}
    </div>
    <label htmlFor="search" className="selection-filter__label">
      Search meals
    </label>
    <div className="selection-filter__search">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        id="search"
        type="search"
        value={props.searchFilter}
        placeholder="Search by name, ingredients and tags"
        onChange={(e) => props.setSearchFilter(e.target.value)}
        autoComplete={"off"}
      />
    </div>
  </div>
);

export default SelectionFilter;
