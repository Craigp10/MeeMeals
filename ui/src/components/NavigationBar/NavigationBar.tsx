import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./scss/compiled.scss";
import { windowSizeContext } from "../../App";

interface Props {
  show: Boolean;
  setShow?: (value: boolean) => void;
}

const NavigationBar = (props: Props) => {
  const windowSize = useContext(windowSizeContext);

  const hideNavBar = () => {
    props.setShow(false);
  };
  return (
    <div
      className={
        windowSize.width < 1024 && props.show
          ? "navigationbar-wrapper shown"
          : "navigationbar-wrapper notShown"
      }
    >
      {windowSize.width < 1024 ? (
        <div className="navigationbar-mobile">
          <span
            className="glyphicon glyphicon-remove"
            onClick={hideNavBar}
          ></span>
        </div>
      ) : null}
      <ul className="navigationbar__linklist" onClick={hideNavBar}>
        <React.Fragment>
          <li>
            <Link className="navigationbar__linklist-link" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="navigationbar__linklist-link" to="/meals">
              Meals
            </Link>
          </li>
          <li>
            <Link className="navigationbar__linklist-link" to="/calendar">
              Calendar
            </Link>
          </li>
        </React.Fragment>
      </ul>
    </div>
  );
};

export default NavigationBar;
