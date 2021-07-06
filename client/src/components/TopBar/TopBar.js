import React from "react";
import logout from "../../images/logout.png";
import "./TopBar.css";

const TopBar = (props) => (
  <div className="topbar-wrapper">
    <div className="topbar-title">
      <span className="topbar-title-text">Mi Meals</span>
    </div>
    <div className="topbar-leftover">
      <span className="topbar-icon">
        <img src={logout} />
      </span>
    </div>
  </div>
);

export default TopBar;
