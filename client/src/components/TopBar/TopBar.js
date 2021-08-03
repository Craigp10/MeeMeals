import React from "react";
import logout from "../../images/logout.png";
import "./TopBar.css";

const TopBar = (props) => (
  <div className="topbar-wrapper">
    <div className="topbar-title">
      <span
        className="topbar-title-text"
        onClick={() => (window.location = window.location.origin)}
      >
        Mi Meals
      </span>
    </div>
    <div className="topbar-leftover">
      <div className="topbar-icon">
        <span
          className="glyphicon glyphicon-user"
          alt="logout"
          onClick={props.logout}
        ></span>
      </div>
    </div>
  </div>
);

export default TopBar;
