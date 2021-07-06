import React from "react";
import "./Homepage.css";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="home-content-wrapper">
        <div className="home-content-board">
          <h2>Welcome to Home Page!</h2>
        </div>
      </div>
    );
  }
}
