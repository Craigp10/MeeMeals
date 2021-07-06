import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <div>
        <Component {...props} />
      </div>
    )}
  />
);

export default PublicRoute;
