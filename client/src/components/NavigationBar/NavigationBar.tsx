import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./scss/compiled.scss";
import { windowSizeContext } from "../../App";

const NavigationBar = (props: any) => {
  const windowSize = useContext(windowSizeContext);

  const hideNavBar = () => {
    props.setShow(false);
  };

  return (
    <div className="navigationbar-wrapper">
      {windowSize.width <= 768 ? (
        <div className="navigationbar-mobile">
          <span
            className="glyphicon glyphicon-remove"
            onClick={hideNavBar}
          ></span>
          <ul className="navigationbar__linklist">
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
      ) : (
        <ul className="navigationbar__linklist">
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
      )}
    </div>
  );
};

export default NavigationBar;
