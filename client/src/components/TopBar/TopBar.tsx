import React from "react";
import logout from "../../images/logout.png";
import "./TopBar.css";

type Props = {
  logout: () => void;
}

const TopBar = (props:Props) => (
  <div className="topbar-wrapper">
    <div className="topbar__title">
      <span
        className="topbar__title-text"
        onClick={() => (window.location.href = window.location.origin)}
      >
        MeeMeals
      </span>
    </div>
    <div className="topbar__leftover">
      <div className="topbar__leftover-icon">
        <span
          className="glyphicon glyphicon-user"
          onClick={props.logout}
        ></span>
      </div>
    </div>
  </div>
);

export default TopBar;
