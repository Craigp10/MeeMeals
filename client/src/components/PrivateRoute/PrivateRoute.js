import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? (
        <div>
          <Component {...props} />
        </div>
      ) : (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
