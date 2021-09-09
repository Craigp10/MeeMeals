import React, { useContext } from "react";
import logout from "../../images/logout.png";
import "./scss/compiled.scss";
import { windowSizeContext } from "../../App";

interface User {
  id: string;
  username: string;
  email: string;
}

type Props = {
  logout?: () => void;
  setShow?: (show: boolean) => void;
  user: User;
};

const TopBar = (props: Props) => {
  const windowSize = useContext(windowSizeContext);
  return (
    <div className="topbar-wrapper">
      {windowSize.width <= 768 ? (
        <>
          <div className="topbar__menu">
            <span
              className="glyphicon glyphicon-th-list"
              onClick={() => props.setShow(true)}
            ></span>
          </div>
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
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default TopBar;
