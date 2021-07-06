import React from "react";
import "./Meals.css";

export default class Meals extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="meals-content-wrapper">
        <div className="meals-content-board">
          <h2>Welcome to Meals Page!</h2>
        </div>
      </div>
    );
  }
}
