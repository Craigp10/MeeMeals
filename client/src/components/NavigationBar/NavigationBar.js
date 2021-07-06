import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = (props) => (
  <div>
    <ul>
      <React.Fragment>
        <li>
          <Link to="/dashboard/">Homes</Link>
        </li>
        <li>
          <Link to="/dashboard/meals">Meals</Link>
        </li>
        <li>
          <Link to="/dashboard/calendar">Calendar</Link>
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

export default NavigationBar;
