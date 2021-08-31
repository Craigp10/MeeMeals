import React from "react";
import logout from "../../images/logout.png";
import "./TopBar.scss";

interface User {
  id: string;
  username: string;
  email: string;
}

type Props = {
  logout: () => void;
  user: User;
};

const TopBar = (props: Props) => {
  console.log("topbar", props.user.username);
  return (
    <div className="topbar-wrapper">
      <div className="topbar__title">
        <span
          className="topbar__title-text"
          onClick={() => (window.location.href = window.location.origin)}
        >
          MeeMeals
        </span>
      </div>
      {/* <div className="topbar__user">Hello, {props.user.username}</div> */}
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
};

export default TopBar;
