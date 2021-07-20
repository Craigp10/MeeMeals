import React from "react";
import logout from "../../images/logout.png";
import "./TopBar.css";

const TopBar = (props) => (
  <div className="topbar-wrapper">
    <div className="topbar-title">
      <span
        className="topbar-title-text"
        onClick={() => (window.location = "http://localhost:8000/")}
      >
        Mi Meals
      </span>
    </div>
    <div className="topbar-leftover">
      <div className="topbar-icon">
        <span className="glyphicon glyphicon-user"></span>
        {/* <img src={logout} /> */}
      </div>
    </div>
  </div>
);

export default TopBar;
