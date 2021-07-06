import React from "react";
import { Link } from "react-router-dom";
import "./NavigationBar.css";
const navigationbar = (props) => (
  <div className="navigationbar-wrapper">
    <ul className="navigationbar-link-list">
      <React.Fragment>
        <li>
          <Link className="navigationbar-link" to="/dashboard/">
            Home
          </Link>
        </li>
        <li>
          <Link className="navigationbar-link" to="/dashboard/meals">
            Meals
          </Link>
        </li>
        <li>
          <Link className="navigationbar-link" to="/dashboard/calendar">
            Calendar
          </Link>
        </li>
      </React.Fragment>
    </ul>
  </div>
);

// DashboardNav.propTypes = {
//   navCollapsed: PropTypes.bool.isRequired,
//   collapseNav: PropTypes.func.isRequired,
//   pageSelected: PropTypes.string.isRequired,
//   setPageName: PropTypes.func.isRequired,
// };

export default navigationbar;
