import React from "react";
import { Link } from "react-router-dom";
import "./NavigationBar.scss";

const navigationbar = () => (
  <div className="navigationbar-wrapper">
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
);

export default navigationbar;
