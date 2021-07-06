import React from "react";
import "./Calendar.css";
export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="calendar-content-wrapper">
        <div className="calendar-content-board">
          <h2>Welcome to Calendar Page!</h2>
        </div>
      </div>
    );
  }
}
